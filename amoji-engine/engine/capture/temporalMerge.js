/**
 * Merge capture-bake temporal envelopes into emotion-timing.json (authoring).
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';

/**
 * Convert a bake envelope into a timing row.
 * @param {{
 *   emotion: string,
 *   onsetSec?: number,
 *   apexSec?: number,
 *   offsetSec?: number,
 *   suggestedStepOutSec?: number,
 *   blinks?: Array<{ durationSec?: number, t?: number }>,
 *   meanBlinkIntervalSec?: number | null,
 *   valid?: boolean,
 * }} envelope
 * @param {{ clamp?: boolean }} [opts]
 */
export function envelopeToTimingRow(envelope, opts = {}) {
  if (!envelope?.emotion) {
    throw new Error('envelope.emotion required');
  }
  const onset = envelope.onsetSec ?? 0;
  const apex = envelope.apexSec ?? onset;
  const offset = envelope.offsetSec ?? apex;
  const attackSec = Math.max(0.08, apex - onset);
  const releaseSec = Math.max(0.1, offset - apex);
  let stepOutSec =
    envelope.suggestedStepOutSec ?? Math.max(0.25, releaseSec * 0.85);
  stepOutSec = Math.max(0.2, Math.min(1.8, stepOutSec));

  const blinks = envelope.blinks || [];
  let blinkDurationSec = 0.16;
  if (blinks.length) {
    blinkDurationSec =
      blinks.reduce((s, b) => s + (b.durationSec || 0.16), 0) / blinks.length;
    blinkDurationSec = Math.max(0.1, Math.min(0.28, blinkDurationSec));
  }

  let blinkRate = null;
  if (envelope.meanBlinkIntervalSec && envelope.meanBlinkIntervalSec > 0.15) {
    blinkRate = Number((1 / envelope.meanBlinkIntervalSec).toFixed(3));
    blinkRate = Math.max(0.04, Math.min(0.6, blinkRate));
  } else if (blinks.length >= 2) {
    const span = blinks[blinks.length - 1].t - blinks[0].t;
    if (span > 0.2) {
      blinkRate = Number(((blinks.length - 1) / span).toFixed(3));
    }
  }

  /** @type {Record<string, unknown>} */
  const row = {
    stepOutSec: Number(stepOutSec.toFixed(3)),
    attackSec: Number(attackSec.toFixed(3)),
    releaseSec: Number(releaseSec.toFixed(3)),
    blinkDurationSec: Number(blinkDurationSec.toFixed(3)),
    source: 'capture-bake',
    bakedAt: new Date().toISOString(),
    envelope: {
      onsetSec: onset,
      apexSec: apex,
      offsetSec: offset,
      valid: envelope.valid !== false,
    },
  };
  if (blinkRate != null) row.blinkRate = blinkRate;

  if (opts.clamp !== false) {
    row.attackSec = Math.max(0.08, Math.min(1.5, /** @type {number} */ (row.attackSec)));
    row.releaseSec = Math.max(0.1, Math.min(1.8, /** @type {number} */ (row.releaseSec)));
  }

  return applyComplianceGate(
    {
      kind: 'temporal_timing_row',
      emotion: envelope.emotion,
      row,
    },
    {},
  );
}

/**
 * Merge one or more bake envelopes into an emotion-timing document.
 * @param {object} timingDoc — emotion-timing.json shape
 * @param {object|object[]} envelopes — bake.envelope (+ emotion) or full bake objects
 * @param {{ overwrite?: boolean, preserveLeakBias?: boolean }} [opts]
 */
export function mergeTemporalEnvelopes(timingDoc, envelopes, opts = {}) {
  const list = Array.isArray(envelopes) ? envelopes : [envelopes];
  const emotions = { ...(timingDoc.emotions || {}) };
  /** @type {string[]} */
  const updated = [];

  for (const item of list) {
    const envelope = item.envelope && item.emotion
      ? { ...item.envelope, emotion: item.emotion }
      : item.kind === 'capture_bake'
        ? { ...item.envelope, emotion: item.emotion }
        : item;
    if (!envelope.emotion) {
      throw new Error('Each envelope needs emotion');
    }
    if (emotions[envelope.emotion] && emotions[envelope.emotion].source === 'hand' && !opts.overwrite) {
      // still allow update but require overwrite when replacing hand? 
      // User asked to fold bake in — default overwrite bake fields, keep leakBias
    }
    const { row } = envelopeToTimingRow(envelope);
    const prev = emotions[envelope.emotion] || {};
    const next = {
      ...prev,
      ...row,
    };
    if (opts.preserveLeakBias !== false && typeof prev.leakBias === 'number') {
      next.leakBias = prev.leakBias;
    }
    if (!opts.overwrite && prev.source === 'hand' && prev.locked) {
      throw new Error(`Emotion "${envelope.emotion}" timing is locked`);
    }
    emotions[envelope.emotion] = next;
    updated.push(envelope.emotion);
  }

  return applyComplianceGate(
    {
      kind: 'emotion_timing_doc',
      ...timingDoc,
      version: timingDoc.version || 1,
      emotions,
      _mergedAt: new Date().toISOString(),
      _updated: updated,
    },
    {},
  );
}
