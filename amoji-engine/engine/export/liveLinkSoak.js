/**
 * Live Link soak harness — synthetic ARKit publish for rate/jitter/drop stats.
 * Runs against an in-memory LiveLinkPublisher (unit tests) or HTTP /publish.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { emptyArkitWeights, ARKIT_CHANNELS } from './arkitExporter.js';
import { LiveLinkPublisher, buildLiveLinkFrame } from './liveLinkFace.js';

/**
 * Build a smooth synthetic ARKit take (jaw/smile/blink cycling).
 * @param {number} tSec
 * @param {{ emotionAmp?: number }} [opts]
 */
export function syntheticArkitAt(tSec, opts = {}) {
  const amp = opts.emotionAmp ?? 0.55;
  const w = emptyArkitWeights();
  const jaw = (Math.sin(tSec * 6.2) * 0.5 + 0.5) * amp * 0.7;
  const smile = (Math.sin(tSec * 1.7 + 0.4) * 0.5 + 0.5) * amp;
  const blink = Math.max(0, Math.sin(tSec * 0.9) - 0.85) * 8;
  w.jawOpen = jaw;
  w.mouthSmileLeft = smile;
  w.mouthSmileRight = smile * 0.98;
  w.eyeBlinkLeft = Math.min(1, blink);
  w.eyeBlinkRight = Math.min(1, blink * 0.95);
  w.browInnerUp = (Math.sin(tSec * 0.55) * 0.5 + 0.5) * amp * 0.35;
  // Keep channel count stable for consumers
  for (const c of ARKIT_CHANNELS) {
    if (typeof w[c] !== 'number') w[c] = 0;
  }
  return w;
}

/**
 * Rolling soak stats.
 */
export class SoakStats {
  constructor() {
    this.reset();
  }

  reset() {
    this.startedAt = 0;
    this.endedAt = 0;
    this.published = 0;
    this.errors = 0;
    this.drops = 0;
    this.latenciesMs = [];
    this.targetFps = 60;
    this.expected = 0;
  }

  /**
   * @param {{ latencyMs?: number, error?: boolean, dropped?: boolean }} [sample]
   */
  record(sample = {}) {
    this.published += sample.error ? 0 : 1;
    if (sample.error) this.errors += 1;
    if (sample.dropped) this.drops += 1;
    if (typeof sample.latencyMs === 'number') {
      this.latenciesMs.push(sample.latencyMs);
    }
  }

  /**
   * @param {number} [p=0.95]
   */
  percentile(p = 0.95) {
    if (!this.latenciesMs.length) return 0;
    const sorted = [...this.latenciesMs].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * p));
    return sorted[idx];
  }

  summary() {
    const elapsedSec = Math.max(0.001, (this.endedAt - this.startedAt) / 1000);
    const fps = this.published / elapsedSec;
    const dropRate =
      this.expected > 0 ? Math.max(0, (this.expected - this.published) / this.expected) : 0;
    return applyComplianceGate(
      {
        kind: 'livelink_soak',
        ok: this.errors === 0 && dropRate < 0.05,
        elapsedSec: Number(elapsedSec.toFixed(3)),
        published: this.published,
        expected: this.expected,
        errors: this.errors,
        drops: this.drops,
        dropRate: Number(dropRate.toFixed(4)),
        fps: Number(fps.toFixed(2)),
        targetFps: this.targetFps,
        p50LatencyMs: Number(this.percentile(0.5).toFixed(2)),
        p95LatencyMs: Number(this.percentile(0.95).toFixed(2)),
        maxLatencyMs: this.latenciesMs.length
          ? Math.max(...this.latenciesMs)
          : 0,
      },
      {},
    );
  }
}

/**
 * Soak an in-memory LiveLinkPublisher (no network).
 * @param {{
 *   durationSec?: number,
 *   fps?: number,
 *   publisher?: LiveLinkPublisher,
 *   now?: () => number,
 * }} [opts]
 */
export function soakPublisher(opts = {}) {
  const durationSec = opts.durationSec ?? 1;
  const fps = opts.fps ?? 60;
  const publisher = opts.publisher || new LiveLinkPublisher({ fps });
  const now = opts.now || (() => Date.now());
  const stats = new SoakStats();
  stats.targetFps = fps;
  stats.startedAt = now();
  const frames = Math.max(1, Math.round(durationSec * fps));
  stats.expected = frames;
  const dt = 1 / fps;

  for (let i = 0; i < frames; i++) {
    const t0 = now();
    const tSec = i * dt;
    const arkit = syntheticArkitAt(tSec);
    try {
      publisher.publishArkit(arkit);
      const latencyMs = Math.max(0, now() - t0);
      stats.record({ latencyMs });
    } catch {
      stats.record({ error: true });
    }
  }
  stats.endedAt = now();
  const summary = stats.summary();
  return applyComplianceGate(
    {
      ...summary,
      lastFrame: publisher.lastFrame,
      frameIndex: publisher.frameIndex,
    },
    {},
  );
}

/**
 * HTTP soak against a running bridge `/publish`.
 * @param {{
 *   url?: string,
 *   durationSec?: number,
 *   fps?: number,
 *   fetchImpl?: typeof fetch,
 *   subject?: string,
 * }} [opts]
 */
export async function soakHttp(opts = {}) {
  const url = opts.url || 'http://127.0.0.1:7879/publish';
  const durationSec = opts.durationSec ?? 2;
  const fps = opts.fps ?? 30;
  const fetchImpl = opts.fetchImpl || globalThis.fetch;
  const stats = new SoakStats();
  stats.targetFps = fps;
  stats.startedAt = Date.now();
  const frames = Math.max(1, Math.round(durationSec * fps));
  stats.expected = frames;
  const dt = 1 / fps;
  const intervalMs = 1000 / fps;

  for (let i = 0; i < frames; i++) {
    const tSec = i * dt;
    const blendShapes = syntheticArkitAt(tSec);
    const t0 = Date.now();
    try {
      if (!fetchImpl) throw new Error('fetch_unavailable');
      const res = await fetchImpl(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: opts.subject || 'AmojiSakura',
          blendShapes,
        }),
      });
      if (!res.ok) {
        stats.record({ error: true, latencyMs: Date.now() - t0 });
      } else {
        stats.record({ latencyMs: Date.now() - t0 });
      }
    } catch {
      stats.record({ error: true, latencyMs: Date.now() - t0 });
    }
    const sleep = intervalMs - (Date.now() - t0);
    if (sleep > 1 && i < frames - 1) {
      await new Promise((r) => setTimeout(r, sleep));
    }
  }
  stats.endedAt = Date.now();
  return stats.summary();
}

/**
 * Validate a frame looks like Live Link ARKit.
 * @param {object} frame
 */
export function assertLiveLinkFrameShape(frame) {
  if (!frame?.blendShapes) return false;
  if (frame.protocol && !String(frame.protocol).includes('livelink')) return false;
  return typeof frame.blendShapes.jawOpen === 'number';
}

export { buildLiveLinkFrame, LiveLinkPublisher };
