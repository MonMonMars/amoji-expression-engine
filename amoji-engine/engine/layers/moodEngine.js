/**
 * Layer -1 — Mood Engine: bias, idle baseline leak, slow transitions.
 */
import moodData from '../../data/moods/catalog.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const MOODS = moodData.moods;
export const MOOD_TRANSITION_HALF_LIFE_SEC = moodData.transitionHalfLifeSec;

/**
 * @param {string} [id]
 */
export function getMoodDef(id) {
  return MOODS[id] || MOODS.neutral;
}

/**
 * Exponential approach factor for half-life (per second).
 * @param {number} dt
 * @param {number} [halfLife=MOOD_TRANSITION_HALF_LIFE_SEC]
 */
export function moodBlendAlpha(dt, halfLife = MOOD_TRANSITION_HALF_LIFE_SEC) {
  const hl = Math.max(0.05, halfLife);
  return 1 - Math.pow(0.5, Math.max(0, dt) / hl);
}

/**
 * Apply mood suppression / facilitation to dialogue intensity.
 * @param {string} emotion
 * @param {number} intensity
 * @param {{ state?: string, baseline_intensity?: number, mix?: number }} mood
 */
export function applyMoodBias(emotion, intensity, mood) {
  if (!mood?.state || mood.state === 'neutral') {
    return {
      intensity: Math.max(0, intensity),
      leakEmotion: null,
      leakIntensity: 0,
      suppression: 0,
      facilitation: 0,
    };
  }
  const def = getMoodDef(mood.state);
  const base = mood.baseline_intensity ?? def.baseline ?? 0.25;
  const mix = mood.mix ?? 1;
  const suppression = (def.suppression?.[emotion] ?? 0) * base * mix;
  const facilitation = (def.facilitation?.[emotion] ?? 0) * base * mix;
  const adjusted = intensity * (1 - suppression) * (1 + facilitation * 0.5);
  return {
    intensity: Math.max(0, Math.min(1.25, adjusted)),
    leakEmotion: mood.state,
    leakIntensity: base * mix * 0.45,
    suppression,
    facilitation,
    gazeBias: def.gazeBias,
    anxiety: def.anxiety,
  };
}

/**
 * Idle baseline morph leak from current mood (Serkis “inner energy floor”).
 * @param {string} moodId
 * @param {number} [baseline]
 * @param {string[]} [available]
 */
export function moodIdleBaseline(moodId, baseline, available) {
  const def = getMoodDef(moodId);
  const b = baseline ?? def.baseline ?? 0;
  const allow = available ? new Set(available) : null;
  /** @type {Record<string, number>} */
  const morphs = {};
  for (const [k, v] of Object.entries(def.signatureMorphs || {})) {
    if (allow && !allow.has(k)) continue;
    morphs[k] = Math.min(1, Number(v) * Math.max(0, Math.min(1, b)));
  }
  return applyComplianceGate(
    {
      kind: 'mood_baseline',
      mood: moodId,
      baseline: b,
      morphs,
      gazeBias: def.gazeBias,
      anxiety: def.anxiety ?? 0.2,
    },
    {},
  );
}

/**
 * Scale signature morphs for passive leak into an active emotion.
 * @param {string} moodId
 * @param {number} leakIntensity
 * @param {string[]} [available]
 */
export function moodSignatureLeak(moodId, leakIntensity, available) {
  return moodIdleBaseline(moodId, leakIntensity, available).morphs;
}

/**
 * Stateful mood with slow crossfade between states.
 */
export class MoodController {
  /**
   * @param {{ state?: string, baseline?: number }} [opts]
   */
  constructor(opts = {}) {
    this.state = opts.state || 'neutral';
    this.targetState = this.state;
    this.baseline = opts.baseline ?? getMoodDef(this.state).baseline;
    this.targetBaseline = this.baseline;
    this.mix = 1; // 1 = fully at current; during transition blends signatures
    this.time = 0;
  }

  /**
   * Request a new mood (slow transition — not instant).
   * @param {string} state
   * @param {number} [baseline]
   */
  setMood(state, baseline) {
    const def = getMoodDef(state);
    this.targetState = MOODS[state] ? state : 'neutral';
    this.targetBaseline =
      typeof baseline === 'number' ? baseline : def.baseline;
  }

  /**
   * @param {number} dt
   */
  tick(dt) {
    this.time += dt;
    const a = moodBlendAlpha(dt);
    this.baseline += (this.targetBaseline - this.baseline) * a;

    if (this.state !== this.targetState) {
      this.mix = Math.max(0, this.mix - a);
      if (this.mix <= 0.05) {
        this.state = this.targetState;
        this.mix = 1;
      }
    } else {
      this.mix = Math.min(1, this.mix + a * 0.5);
    }

    const from = moodIdleBaseline(this.state, this.baseline * this.mix);
    const to =
      this.state !== this.targetState
        ? moodIdleBaseline(this.targetState, this.baseline * (1 - this.mix))
        : { morphs: {} };
    /** @type {Record<string, number>} */
    const morphs = { ...from.morphs };
    for (const [k, v] of Object.entries(to.morphs || {})) {
      morphs[k] = Math.max(morphs[k] || 0, v);
    }

    const def = getMoodDef(this.state);
    return applyComplianceGate(
      {
        kind: 'mood',
        state: this.state,
        targetState: this.targetState,
        baseline: this.baseline,
        mix: this.mix,
        transitioning: this.state !== this.targetState,
        morphs,
        gazeBias: def.gazeBias,
        anxiety: def.anxiety,
        bias: (emotion, intensity) =>
          applyMoodBias(emotion, intensity, {
            state: this.state,
            baseline_intensity: this.baseline,
            mix: this.mix,
          }),
      },
      {},
    );
  }
}
