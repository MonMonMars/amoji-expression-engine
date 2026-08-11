/**
 * Affect staging — intensity-aware finger/look hints beyond static maps.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import {
  fingerPresetForAffect,
  syncAffectToFinger,
} from '../export/emblemFingerSync.js';

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
