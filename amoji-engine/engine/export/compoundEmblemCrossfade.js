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

/** Extra hold after crossfade reaches emblem (seconds). */
export const COMPOUND_EMBLEM_HOLD_SEC = 0.55;
/** Release blend back toward compound affect (seconds). */
export const COMPOUND_EMBLEM_RELEASE_SEC = 0.4;

/**
 * Full compound→emblem lifecycle: crossfade → hold → release → done.
 * @param {string} compoundId
 * @param {number} [intensity]
 * @param {number} [elapsedSec] time since kickoff
 * @param {{
 *   articulate?: boolean,
 *   emblemId?: string|null,
 *   crossfadeSec?: number,
 *   holdSec?: number,
 *   releaseSec?: number,
 * }} [opts]
 */
export function compoundEmblemLifecycle(
  compoundId,
  intensity = 0.7,
  elapsedSec = 0,
  opts = {},
) {
  const kick = crossfadeCompoundToEmblem(compoundId, intensity, 0, opts);
  if (!kick.ok) {
    return applyComplianceGate(
      {
        kind: 'compound_emblem_lifecycle',
        ok: false,
        error: kick.error || 'unknown_compound',
        compoundId,
        phase: 'done',
        scientific: false,
      },
      {},
    );
  }
  const crossfadeSec = Math.max(
    0.2,
    opts.crossfadeSec ?? kick.durationSec ?? 0.9,
  );
  const holdSec = Math.max(
    0,
    opts.holdSec ?? (kick.emblemId ? COMPOUND_EMBLEM_HOLD_SEC : 0),
  );
  const releaseSec = Math.max(
    0.05,
    opts.releaseSec ?? (kick.emblemId ? COMPOUND_EMBLEM_RELEASE_SEC : 0.25),
  );
  const tElapsed = Math.max(0, Number(elapsedSec) || 0);
  const totalSec = crossfadeSec + holdSec + releaseSec;

  /** @type {'crossfade'|'hold'|'release'|'done'} */
  let phase = 'crossfade';
  let gesture = kick.gesture;
  let fingerPresetId = kick.fingerPresetId;
  let emblemId = kick.emblemId;
  let clearEmblem = false;
  let t = 0;
  let ease = 0;

  if (tElapsed < crossfadeSec) {
    phase = 'crossfade';
    t = crossfadeSec > 0 ? tElapsed / crossfadeSec : 1;
    const xf = crossfadeCompoundToEmblem(compoundId, intensity, t, opts);
    gesture = xf.gesture;
    fingerPresetId = xf.fingerPresetId;
    emblemId = xf.emblemId;
    ease = xf.ease;
  } else if (tElapsed < crossfadeSec + holdSec) {
    phase = 'hold';
    t = 1;
    const held = crossfadeCompoundToEmblem(compoundId, intensity, 1, opts);
    gesture = held.gesture;
    fingerPresetId = held.fingerPresetId;
    emblemId = held.emblemId;
    ease = 1;
  } else if (tElapsed < totalSec) {
    phase = 'release';
    const u = (tElapsed - crossfadeSec - holdSec) / releaseSec;
    ease = crossfadeEase(u);
    const held = crossfadeCompoundToEmblem(compoundId, intensity, 1, opts);
    const base = stageCompoundAffect(compoundId, intensity, opts);
    gesture = lerpGesture(held.gesture, base.gesture, ease);
    fingerPresetId =
      ease >= 0.5 ? base.fingerPresetId || held.fingerPresetId : held.fingerPresetId;
    emblemId = held.emblemId;
    // mid-release: keep emblem id for UI until done
  } else {
    phase = 'done';
    t = 1;
    const base = stageCompoundAffect(compoundId, intensity, opts);
    gesture = base.gesture ? { ...base.gesture } : null;
    fingerPresetId = base.fingerPresetId;
    emblemId = kick.emblemId;
    clearEmblem = !!kick.emblemId;
    ease = 1;
  }

  return applyComplianceGate(
    {
      kind: 'compound_emblem_lifecycle',
      ok: true,
      compoundId,
      label: kick.label,
      intensity: Number(intensity) || 0,
      elapsedSec: tElapsed,
      phase,
      t,
      ease,
      emblemId: emblemId || null,
      clearEmblem,
      fingerPresetId: fingerPresetId || null,
      gesture,
      lookBias: kick.lookBias,
      crossfadeSec,
      holdSec,
      releaseSec,
      totalSec,
      scientific: false,
    },
    {},
  );
}
