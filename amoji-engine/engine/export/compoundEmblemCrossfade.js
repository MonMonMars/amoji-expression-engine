/**
 * Compound emotion → emblem crossfade (finger/gesture blend over t∈[0,1]).
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { getCompound } from '../layers/compoundEmotion.js';
import { GESTURE_EMBLEMS } from '../layers/gesture.js';
import { stageCompoundAffect } from './affectStaging.js';
import { syncEmblemToFinger } from './emblemFingerSync.js';

/**
 * Suggested emblem when a compound is staged (presentation cue, not science).
 * null → finger-only crossfade (no emblem fire).
 */
export const COMPOUND_TO_EMBLEM = {
  happy_surprised: 'wave',
  sad_angry: 'stopPalm',
  fear_disgust: 'stopPalm',
  fear_surprised: 'point',
  angry_disgust: 'stopPalm',
  sad_fear: null,
};

/**
 * @param {string} compoundId
 * @returns {string|null}
 */
export function emblemForCompound(compoundId) {
  if (!compoundId) return null;
  if (Object.prototype.hasOwnProperty.call(COMPOUND_TO_EMBLEM, compoundId)) {
    return COMPOUND_TO_EMBLEM[compoundId];
  }
  const def = getCompound(compoundId);
  if (!def) return null;
  // soft fallback from primary affect
  if (def.primary === 'happy' || def.primary === 'surprised') return 'wave';
  if (def.primary === 'angry' || def.primary === 'disgust') return 'stopPalm';
  if (def.primary === 'fear') return 'point';
  return null;
}

/**
 * Smoothstep ease for crossfade.
 * @param {number} t
 */
export function crossfadeEase(t) {
  const x = Math.max(0, Math.min(1, Number(t) || 0));
  return x * x * (3 - 2 * x);
}

/**
 * Lerp gesture maps.
 * @param {Record<string, number>|null|undefined} a
 * @param {Record<string, number>|null|undefined} b
 * @param {number} t
 */
export function lerpGesture(a, b, t) {
  if (!a && !b) return null;
  if (!a) return { ...b };
  if (!b) return { ...a };
  const u = Math.max(0, Math.min(1, t));
  /** @type {Record<string, number>} */
  const out = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    const va = typeof a[k] === 'number' ? a[k] : 0;
    const vb = typeof b[k] === 'number' ? b[k] : 0;
    out[k] = va + (vb - va) * u;
  }
  return out;
}

/**
 * Crossfade compound affect staging → emblem finger pose.
 * @param {string} compoundId
 * @param {number} [intensity]
 * @param {number} [t] 0 = compound only, 1 = full emblem
 * @param {{ articulate?: boolean, emblemId?: string|null, durationSec?: number }} [opts]
 */
export function crossfadeCompoundToEmblem(
  compoundId,
  intensity = 0.7,
  t = 0,
  opts = {},
) {
  const def = getCompound(compoundId);
  if (!def) {
    return applyComplianceGate(
      {
        kind: 'compound_emblem_crossfade',
        ok: false,
        error: 'unknown_compound',
        compoundId,
        scientific: false,
      },
      {},
    );
  }
  const staged = stageCompoundAffect(compoundId, intensity, opts);
  const emblemId =
    opts.emblemId !== undefined ? opts.emblemId : emblemForCompound(compoundId);
  const emblemOk = !!(emblemId && GESTURE_EMBLEMS[emblemId]);
  const emblemSync = emblemOk
    ? syncEmblemToFinger(emblemId, { articulate: opts.articulate !== false })
    : null;
  const ease = crossfadeEase(t);
  const from = staged.gesture;
  const to = emblemSync?.gesture || null;
  const gesture = emblemOk ? lerpGesture(from, to, ease) : from ? { ...from } : null;
  const fingerPresetId =
    ease >= 0.5 && emblemSync?.fingerPresetId
      ? emblemSync.fingerPresetId
      : staged.fingerPresetId;

  return applyComplianceGate(
    {
      kind: 'compound_emblem_crossfade',
      ok: true,
      compoundId,
      label: def.label,
      primary: def.primary,
      secondary: def.secondary,
      intensity: Number(intensity) || 0,
      t: Math.max(0, Math.min(1, Number(t) || 0)),
      ease,
      emblemId: emblemOk ? emblemId : null,
      emblemSynced: !!(emblemSync && emblemSync.synced),
      fingerPresetId: fingerPresetId || null,
      gesture,
      digits:
        ease >= 0.5 ? emblemSync?.digits || staged.digits : staged.digits || null,
      lookBias: staged.lookBias,
      durationSec: opts.durationSec ?? (emblemOk ? GESTURE_EMBLEMS[emblemId].durationSec || 1.2 : 0.8),
      scientific: false,
    },
    {},
  );
}
