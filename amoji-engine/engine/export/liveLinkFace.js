/**
 * Live Link Face–compatible ARKit frame publisher (JSON over WebSocket / UDP-ready).
 * Unreal consumes via Remote Control Python or a Live Link source plugin.
 */
import { ARKIT_CHANNELS, emptyArkitWeights, morphWeightsToArkit } from './arkitExporter.js';
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const LIVELINK_PROTOCOL = 'amoji.livelink.arkit.v1';

/**
 * Build one Live Link–style subject frame from ARKit weights.
 * @param {Record<string, number>} arkitWeights
 * @param {{
 *   subject?: string,
 *   frame?: number,
 *   fps?: number,
 *   timecode?: string,
 * }} [meta]
 */
export function buildLiveLinkFrame(arkitWeights, meta = {}) {
  const blendShapes = emptyArkitWeights();
  for (const c of ARKIT_CHANNELS) {
    const v = arkitWeights[c];
    blendShapes[c] = typeof v === 'number' ? Math.max(0, Math.min(1, v)) : 0;
  }

  const frame = {
    protocol: LIVELINK_PROTOCOL,
    subject: meta.subject || 'AmojiSakura',
    frame: meta.frame ?? 0,
    fps: meta.fps ?? 60,
    timecode: meta.timecode || null,
    timestampMs: Date.now(),
    blendShapes,
  };

  return applyComplianceGate(frame, {});
}

/**
 * Morph Expression_* weights → Live Link frame.
 * @param {Record<string, number>} morphWeights
 * @param {Parameters<typeof buildLiveLinkFrame>[1]} [meta]
 */
export function morphsToLiveLinkFrame(morphWeights, meta) {
  return buildLiveLinkFrame(morphWeightsToArkit(morphWeights), meta);
}

/**
 * Encode frame as newline-delimited JSON (bridge wire format).
 * @param {ReturnType<typeof buildLiveLinkFrame>} frame
 */
export function encodeLiveLinkLine(frame) {
  return `${JSON.stringify(frame)}\n`;
}

/**
 * Minimal in-memory publisher (Face Live / Node bridge push here).
 */
export class LiveLinkPublisher {
  /**
   * @param {{ subject?: string, fps?: number }} [opts]
   */
  constructor(opts = {}) {
    this.subject = opts.subject || 'AmojiSakura';
    this.fps = opts.fps || 60;
    this.frameIndex = 0;
    /** @type {Set<(frame: object) => void>} */
    this.listeners = new Set();
    this.lastFrame = null;
  }

  /**
   * @param {(frame: object) => void} fn
   */
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /**
   * @param {Record<string, number>} arkitWeights
   */
  publishArkit(arkitWeights) {
    const frame = buildLiveLinkFrame(arkitWeights, {
      subject: this.subject,
      frame: this.frameIndex++,
      fps: this.fps,
    });
    this.lastFrame = frame;
    for (const fn of this.listeners) fn(frame);
    return frame;
  }

  /**
   * @param {Record<string, number>} morphWeights
   */
  publishMorphs(morphWeights) {
    return this.publishArkit(morphWeightsToArkit(morphWeights));
  }
}
