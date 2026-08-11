/**
 * Affect staging — intensity-aware finger/look hints beyond static maps.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import {
  fingerPresetForAffect,
  syncAffectToFinger,
} from '../export/emblemFingerSync.js';
import { getCompound } from '../layers/compoundEmotion.js';

/** Soft aliases for mood-ish emotion labels → catalog keys */
export const AFFECT_ALIASES = {
  embarrassed: 'sad',
  anxious: 'fear',
  suspicious: 'thinking',
  tired: 'sad',
  content: 'happy',
  irritable: 'angry',
  melancholy: 'sad',
  smile_open: 'smile_open',
};

/**
 * @param {string} emotion
 */
export function resolveAffectKey(emotion) {
  if (!emotion) return 'neutral';
  return AFFECT_ALIASES[emotion] || emotion;
}

/**
 * Intensity bands for staging amplitude.
 * @param {number} intensity
 */
export function affectStagingBand(intensity = 0.7) {
  const t = Math.max(0, Math.min(1.25, Number(intensity) || 0));
  if (t < 0.35) return 'soft';
  if (t < 0.75) return 'medium';
  if (t <= 1) return 'full';
  return 'overdrive';
}

/**
 * Scale factor for fist/open blend by band.
 * @param {string} band
 */
export function affectBandScale(band) {
  switch (band) {
    case 'soft':
      return 0.45;
    case 'medium':
      return 0.75;
    case 'full':
      return 1;
    case 'overdrive':
      return 1.15;
    default:
      return 0.75;
  }
}

/**
 * Build an intensity-scaled staging cue from emotion.
 * @param {string} emotion
 * @param {number} [intensity]
 * @param {{ articulate?: boolean }} [opts]
 */
export function stageAffect(emotion, intensity = 0.7, opts = {}) {
  const key = resolveAffectKey(emotion);
  const band = affectStagingBand(intensity);
  const scale = affectBandScale(band);
  const fingerPresetId = fingerPresetForAffect(key);
  const synced = fingerPresetId
    ? syncAffectToFinger(key, { articulate: opts.articulate !== false })
    : null;

  /** @type {Record<string, number>|null} */
  let gesture = synced?.gesture ? { ...synced.gesture } : null;
  if (gesture && typeof gesture.fist === 'number') {
    gesture = {
      ...gesture,
      fist: Math.max(0, Math.min(1, gesture.fist * scale)),
      handOpen:
        typeof gesture.handOpen === 'number'
          ? Math.max(0, Math.min(1, gesture.handOpen * (band === 'soft' ? 1.1 : scale)))
          : gesture.handOpen,
    };
  }

  /** Optional look bias for staging (not scientific) */
  const lookBias =
    key === 'sad' || key === 'fear'
      ? { lookY: -0.12 * scale, lookX: 0 }
      : key === 'angry'
        ? { lookY: -0.05 * scale, lookX: 0 }
        : key === 'thinking'
          ? { lookY: 0.15 * scale, lookX: -0.1 * scale }
          : key === 'surprised' || key === 'happy' || key === 'smile_open'
            ? { lookY: 0.08 * scale, lookX: 0 }
            : { lookX: 0, lookY: 0 };

  return applyComplianceGate(
    {
      kind: 'affect_staging',
      emotion,
      affectKey: key,
      intensity: Number(intensity) || 0,
      band,
      scale,
      fingerPresetId: fingerPresetId || null,
      synced: !!synced?.synced,
      gesture,
      digits: synced?.digits || null,
      lookBias,
      scientific: false,
    },
    {},
  );
}

/**
 * Blend two look biases.
 * @param {{ lookX?: number, lookY?: number }} a
 * @param {{ lookX?: number, lookY?: number }} b
 * @param {number} wA weight for a (0..1)
 */
function blendLook(a, b, wA = 0.6) {
  const wB = 1 - wA;
  return {
    lookX: (a?.lookX || 0) * wA + (b?.lookX || 0) * wB,
    lookY: (a?.lookY || 0) * wA + (b?.lookY || 0) * wB,
  };
}

/**
 * Blend fist/open gesture maps (primary-weighted).
 * @param {Record<string, number>|null} a
 * @param {Record<string, number>|null} b
 * @param {number} wA
 */
function blendGesture(a, b, wA = 0.65) {
  if (!a && !b) return null;
  if (!a) return { ...b };
  if (!b) return { ...a };
  const wB = 1 - wA;
  /** @type {Record<string, number>} */
  const out = { ...a };
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    const va = typeof a[k] === 'number' ? a[k] : 0;
    const vb = typeof b[k] === 'number' ? b[k] : 0;
    out[k] = Math.max(0, Math.min(1.25, va * wA + vb * wB));
  }
  return out;
}

/**
 * Stage finger/look cues for a region-locked compound emotion.
 * Primary affect owns fingers; secondary softens look + gesture blend.
 *
 * @param {string} compoundId
 * @param {number} [intensity]
 * @param {{ articulate?: boolean, primaryWeight?: number }} [opts]
 */
export function stageCompoundAffect(compoundId, intensity = 0.7, opts = {}) {
  const def = getCompound(compoundId);
  if (!def) {
    return applyComplianceGate(
      {
        kind: 'affect_staging_compound',
        ok: false,
        error: 'unknown_compound',
        compoundId,
        scientific: false,
      },
      {},
    );
  }
  const t = Number(intensity) || 0;
  const wP = Math.max(0.5, Math.min(0.85, opts.primaryWeight ?? 0.65));
  const primary = stageAffect(def.primary, t, opts);
  const secondary = stageAffect(def.secondary, t * 0.9, opts);
  const band = affectStagingBand(t);
  const gesture = blendGesture(primary.gesture, secondary.gesture, wP);
  const lookBias = blendLook(primary.lookBias, secondary.lookBias, wP);

  return applyComplianceGate(
    {
      kind: 'affect_staging_compound',
      ok: true,
      compoundId,
      label: def.label,
      primary: def.primary,
      secondary: def.secondary,
      intensity: t,
      band,
      scale: affectBandScale(band),
      primaryWeight: wP,
      fingerPresetId: primary.fingerPresetId || secondary.fingerPresetId || null,
      secondaryFingerPresetId: secondary.fingerPresetId || null,
      synced: !!(primary.synced || secondary.synced),
      gesture,
      digits: primary.digits || secondary.digits || null,
      lookBias,
      ownership: def.ownership || null,
      scientific: false,
    },
    {},
  );
}
