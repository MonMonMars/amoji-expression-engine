/**
 * MediaPipe Face Landmarker → ARKit 52 adapter (authoring capture).
 * Converts webcam/video blendshape categories into Live Link–compatible frames
 * for capture-bake. Not a runtime biometric product path.
 */
import aliasesData from '../../data/capture/mediapipe-arkit-aliases.json' with { type: 'json' };
import { ARKIT_CHANNELS, emptyArkitWeights } from '../export/arkitExporter.js';
import { LIVELINK_PROTOCOL } from '../export/liveLinkFace.js';
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { expressionEnergy } from './captureBake.js';

export const MEDIAPIPE_CAPTURE_PROTOCOL = 'amoji.capture.mediapipe.v1';
export const MEDIAPIPE_ALIASES = aliasesData.aliases;

/**
 * Map a MediaPipe category name → ARKit channel (or null to drop).
 * @param {string} name
 * @param {Record<string, string|null>} [aliases]
 */
export function resolveMediaPipeChannel(name, aliases = MEDIAPIPE_ALIASES) {
  if (!name) return null;
  if (Object.prototype.hasOwnProperty.call(aliases, name)) {
    return aliases[name];
  }
  // PascalCase / spaced variants
  const camel = name.charAt(0).toLowerCase() + name.slice(1).replace(/\s+/g, '');
  if (Object.prototype.hasOwnProperty.call(aliases, camel)) {
    return aliases[camel];
  }
  if (ARKIT_CHANNELS.includes(name)) return name;
  if (ARKIT_CHANNELS.includes(camel)) return camel;
  return null;
}

/**
 * Convert MediaPipe faceBlendshapes categories → ARKit weight vector.
 * Accepts:
 *  - Array<{ categoryName|displayName|name, score|value }>
 *  - Record<string, number>
 * @param {Array<object>|Record<string, number>|null|undefined} categories
 * @param {{ aliases?: Record<string, string|null> }} [opts]
 */
export function mediaPipeCategoriesToArkit(categories, opts = {}) {
  const aliases = opts.aliases || MEDIAPIPE_ALIASES;
  const out = emptyArkitWeights();
  if (!categories) return out;

  if (Array.isArray(categories)) {
    for (const cat of categories) {
      const name = cat.categoryName || cat.displayName || cat.name;
      const score = Number(cat.score ?? cat.value ?? 0);
      const channel = resolveMediaPipeChannel(name, aliases);
      if (!channel || Number.isNaN(score)) continue;
      out[channel] = Math.max(0, Math.min(1, score));
    }
    return out;
  }

  if (typeof categories === 'object') {
    for (const [name, score] of Object.entries(categories)) {
      const channel = resolveMediaPipeChannel(name, aliases);
      if (!channel) continue;
      const v = Number(score);
      if (Number.isNaN(v)) continue;
      out[channel] = Math.max(0, Math.min(1, v));
    }
  }
  return out;
}

/**
 * One capture frame from a MediaPipe FaceLandmarker result (or pre-mapped ARKit).
 * @param {{
 *   faceBlendshapes?: Array<{ categories?: object[] }|object[]>,
 *   blendshapes?: object[],
 *   categories?: object[],
 *   blendShapes?: Record<string, number>,
 * }} result
 * @param {{
 *   t?: number,
 *   frame?: number,
 *   fps?: number,
 *   subject?: string,
 *   timestampMs?: number,
 * }} [meta]
 */
export function mediaPipeResultToFrame(result, meta = {}) {
  let categories = null;
  if (result?.blendShapes && typeof result.blendShapes === 'object' && !Array.isArray(result.blendShapes)) {
    categories = result.blendShapes;
  } else if (Array.isArray(result?.categories)) {
    categories = result.categories;
  } else if (Array.isArray(result?.blendshapes)) {
    categories = result.blendshapes;
  } else if (Array.isArray(result?.faceBlendshapes) && result.faceBlendshapes[0]) {
    const first = result.faceBlendshapes[0];
    categories = first.categories || first;
  }

  const blendShapes = mediaPipeCategoriesToArkit(categories);
  const fps = meta.fps || 30;
  const frame = meta.frame ?? 0;
  const t = meta.t ?? frame / fps;

  return applyComplianceGate(
    {
      protocol: LIVELINK_PROTOCOL,
      source: MEDIAPIPE_CAPTURE_PROTOCOL,
      subject: meta.subject || 'MediaPipeCapture',
      frame,
      fps,
      t: Number(t.toFixed(4)),
      timestampMs: meta.timestampMs ?? Date.now(),
      blendShapes,
      energy: Number(expressionEnergy(blendShapes).toFixed(4)),
    },
    {},
  );
}

/**
 * Session recorder — push MediaPipe results while recording, export NDJSON / take JSON.
 */
export class MediaPipeCaptureSession {
  /**
   * @param {{ subject?: string, fps?: number, emotion?: string }} [opts]
   */
  constructor(opts = {}) {
    this.subject = opts.subject || 'MediaPipeCapture';
    this.fps = opts.fps || 30;
    this.emotion = opts.emotion || null;
    /** @type {ReturnType<typeof mediaPipeResultToFrame>[]} */
    this.frames = [];
    this.recording = false;
    this.startedAt = 0;
    this.frameIndex = 0;
  }

  start(emotion) {
    if (emotion) this.emotion = emotion;
    this.frames = [];
    this.frameIndex = 0;
    this.startedAt = performanceNow();
    this.recording = true;
  }

  stop() {
    this.recording = false;
    return this.frameCount;
  }

  get frameCount() {
    return this.frames.length;
  }

  get durationSec() {
    if (!this.frames.length) return 0;
    return this.frames[this.frames.length - 1].t - this.frames[0].t;
  }

  /**
   * @param {Parameters<typeof mediaPipeResultToFrame>[0]} result
   * @param {{ timestampMs?: number }} [meta]
   */
  pushResult(result, meta = {}) {
    if (!this.recording) return null;
    const now = performanceNow();
    const t = (now - this.startedAt) / 1000;
    const frame = mediaPipeResultToFrame(result, {
      t,
      frame: this.frameIndex++,
      fps: this.fps,
      subject: this.subject,
      timestampMs: meta.timestampMs ?? Date.now(),
    });
    this.frames.push(frame);
    return frame;
  }

  /**
   * Push an already-mapped ARKit vector (tests / alternate trackers).
   * @param {Record<string, number>} blendShapes
   * @param {{ t?: number }} [meta]
   */
  pushArkit(blendShapes, meta = {}) {
    if (!this.recording) return null;
    const t =
      meta.t ??
      (this.frames.length ? this.frames[this.frames.length - 1].t + 1 / this.fps : 0);
    const frame = mediaPipeResultToFrame(
      { blendShapes },
      {
        t,
        frame: this.frameIndex++,
        fps: this.fps,
        subject: this.subject,
      },
    );
    this.frames.push(frame);
    return frame;
  }

  /** Full take object for capture-bake.parseCaptureTake */
  toTake() {
    return applyComplianceGate(
      {
        protocol: MEDIAPIPE_CAPTURE_PROTOCOL,
        emotion: this.emotion,
        subject: this.subject,
        fps: this.fps,
        note: 'Authoring capture from MediaPipe — bake offline; do not use as runtime biometric input.',
        frames: this.frames.map((f) => ({
          protocol: f.protocol,
          subject: f.subject,
          frame: f.frame,
          fps: f.fps,
          t: f.t,
          timestampMs: f.timestampMs,
          blendShapes: f.blendShapes,
        })),
      },
      {},
    );
  }

  /** NDJSON string (one Live Link–compatible frame per line) */
  toNDJSON() {
    return this.frames
      .map((f) =>
        JSON.stringify({
          protocol: f.protocol,
          subject: f.subject,
          frame: f.frame,
          fps: f.fps,
          t: f.t,
          timestampMs: f.timestampMs,
          blendShapes: f.blendShapes,
        }),
      )
      .join('\n');
  }

  clear() {
    this.frames = [];
    this.frameIndex = 0;
    this.recording = false;
  }
}

function performanceNow() {
  return typeof performance !== 'undefined' && performance.now
    ? performance.now()
    : Date.now();
}

/**
 * Nonzero ARKit dump for HUD.
 * @param {Record<string, number>} blendShapes
 * @param {number} [eps=0.04]
 */
export function arkitHudLines(blendShapes, eps = 0.04) {
  return Object.entries(blendShapes)
    .filter(([, v]) => v > eps)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .map(([k, v]) => `${k}: ${v.toFixed(2)}`);
}
