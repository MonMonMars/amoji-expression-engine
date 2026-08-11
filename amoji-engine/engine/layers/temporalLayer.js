/**
 * Phase 3 — Temporal Authenticity Layer
 * Blink (mood-modulated) · micro-leak (eyes-before-mouth) · Step-Out exit curves
 * Timing tables live in data/temporal/emotion-timing.json (capture-bake can update).
 */
import timingData from '../../data/temporal/emotion-timing.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';

/** @typedef {'upper'|'lower'|'full'} LeakRegion */

export const EMOTION_TIMING = timingData;
export const TIMING_DEFAULTS = timingData.defaults;

/**
 * @param {string} emotion
 */
export function getEmotionTiming(emotion) {
  const row = timingData.emotions?.[emotion];
  if (!row) {
    return {
      ...TIMING_DEFAULTS,
      emotion,
      source: 'default',
    };
  }
  return { emotion, ...TIMING_DEFAULTS, ...row };
}

/** @returns {Record<string, number>} */
function mapField(field, fallback) {
  /** @type {Record<string, number>} */
  const out = {};
  for (const [id, row] of Object.entries(timingData.emotions || {})) {
    const v = row[field];
    out[id] = typeof v === 'number' ? v : fallback;
  }
  return out;
}

/** Baseline blinks per second by emotion mood band */
export const BLINK_RATE = mapField('blinkRate', TIMING_DEFAULTS.blinkRate);

/** Exit duration seconds for Step-Out (Alba Emoting leave-to-neutral) */
export const STEP_OUT_DURATION = mapField('stepOutSec', TIMING_DEFAULTS.stepOutSec);

/** Attack duration (onset→apex) for entering an emotion */
export const ATTACK_DURATION = mapField('attackSec', TIMING_DEFAULTS.attackSec);

/** Leak likelihood / amplitude bias (fear leaks most, happy least) */
export const LEAK_BIAS = mapField('leakBias', TIMING_DEFAULTS.leakBias);

/**
 * Smoothstep 0..1
 * @param {number} x
 */
export function smoothstep(x) {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

/**
 * Step-Out weight remaining on previous emotion (1 → 0 over duration).
 * @param {number} elapsed
 * @param {number} duration
 */
export function stepOutCurve(elapsed, duration) {
  if (duration <= 0) return 0;
  const u = Math.max(0, Math.min(1, elapsed / duration));
  // Ease-out: fast release early, soft settle (breath/shoulder feel)
  return 1 - smoothstep(Math.pow(u, 0.75));
}

/**
 * @param {string} emotion
 * @param {{ tense?: boolean, speaking?: boolean }} [ctx]
 */
export function blinkIntervalSec(emotion, ctx = {}) {
  const timing = getEmotionTiming(emotion);
  let rate = timing.blinkRate ?? BLINK_RATE.neutral ?? TIMING_DEFAULTS.blinkRate;
  if (ctx.tense) rate *= 1.45;
  if (ctx.speaking) rate *= 0.7;
  rate = Math.max(0.04, rate);
  // randomized interval around mean
  const mean = 1 / rate;
  const jitter = 0.55 + Math.random() * 0.9;
  return mean * jitter;
}

/**
 * Blink eyelid envelope 0..1 for a blink of given duration.
 * @param {number} age age since blink start
 * @param {number} [duration=0.16]
 */
export function blinkEnvelope(age, duration = 0.16) {
  if (age < 0 || age > duration) return 0;
  return Math.sin((age / duration) * Math.PI);
}

/**
 * Attack curve 0→1 over onset→apex window (from capture bake).
 * @param {number} elapsed
 * @param {number} duration
 */
export function attackCurve(elapsed, duration) {
  if (duration <= 0) return 1;
  const u = Math.max(0, Math.min(1, elapsed / duration));
  return smoothstep(u);
}

/**
 * Micro-leak schedule: eyes first, then optional mouth cover (先眼後口).
 * @param {{
 *   suppressedEmotion: string,
 *   surfaceEmotion: string,
 *   suppressedIntensity?: number,
 *   durationMs?: number,
 *   region?: LeakRegion,
 *   symmetry?: number,
 * }} opts
 */
export function planMicroLeak(opts) {
  const intensity = Math.max(0, Math.min(1, opts.suppressedIntensity ?? 0.6));
  const bias = LEAK_BIAS[opts.suppressedEmotion] ?? 0.35;
  const p = Math.min(0.95, bias * (0.35 + intensity));
  const durationMs = opts.durationMs ?? Math.round(80 + intensity * 160); // ~80–240ms
  const region = opts.region ?? (Math.random() < 0.7 ? 'upper' : 'full');
  const symmetry = opts.symmetry ?? (0.35 + Math.random() * 0.55); // prefer asymmetric

  return {
    eventType: 'microLeak',
    suppressedEmotion: opts.suppressedEmotion,
    surfaceEmotion: opts.surfaceEmotion,
    probability: p,
    durationMs,
    region,
    symmetry,
    /** eyes lead; mouth cover only after eyes peak */
    phases: {
      eyesStartMs: 0,
      eyesPeakMs: Math.round(durationMs * 0.35),
      mouthCoverStartMs: Math.round(durationMs * 0.45),
      endMs: durationMs,
    },
  };
}

/**
 * Evaluate leak morph overlays at time tMs into the leak.
 * @param {ReturnType<typeof planMicroLeak>} plan
 * @param {number} tMs
 * @param {Record<string, Record<string, number>>} recipes HI_RECIPES-like
 */
export function evaluateMicroLeak(plan, tMs, recipes) {
  /** @type {Record<string, number>} */
  const weights = {};
  if (!plan || tMs < 0 || tMs > plan.phases.endMs) return weights;

  const eyeRecipe = recipes[plan.suppressedEmotion] || {};
  const surfaceRecipe = recipes[plan.surfaceEmotion] || {};
  const { eyesStartMs, eyesPeakMs, mouthCoverStartMs, endMs } = plan.phases;

  // Eyes flash
  if (tMs >= eyesStartMs && tMs <= mouthCoverStartMs) {
    const u =
      tMs <= eyesPeakMs
        ? (tMs - eyesStartMs) / Math.max(1, eyesPeakMs - eyesStartMs)
        : 1 - (tMs - eyesPeakMs) / Math.max(1, mouthCoverStartMs - eyesPeakMs);
    const amp = smoothstep(u) * plan.probability * 0.85;
    for (const [k, v] of Object.entries(eyeRecipe)) {
      if (!isUpperFaceMorph(k)) continue;
      let w = v * amp;
      if (plan.region === 'upper' || plan.region === 'full') {
        if (plan.symmetry > 0.5 && k.includes('R_')) w *= 1 - (plan.symmetry - 0.5);
        if (plan.symmetry > 0.5 && k.includes('L_')) w *= 0.55 + plan.symmetry * 0.45;
        weights[k] = Math.max(weights[k] || 0, Math.min(1, w));
      }
    }
  }

  // Mouth cover (surface) — only after eyes (先眼後口)
  if (tMs >= mouthCoverStartMs && tMs <= endMs) {
    const u = (tMs - mouthCoverStartMs) / Math.max(1, endMs - mouthCoverStartMs);
    const amp = smoothstep(u) * 0.55;
    for (const [k, v] of Object.entries(surfaceRecipe)) {
      if (!isLowerFaceMorph(k) && plan.region === 'upper') continue;
      weights[k] = Math.max(weights[k] || 0, Math.min(1, v * amp));
    }
  }

  return weights;
}

/** @param {string} name */
export function isUpperFaceMorph(name) {
  return /brow|eye|squint|lid|pupil/i.test(name);
}

/** @param {string} name */
export function isLowerFaceMorph(name) {
  return /mouth|jaw|chin|lip|sneer|nostril|cheek/i.test(name);
}

/**
 * Stateful temporal performer for realtime tick loops.
 */
export class TemporalLayer {
  /**
   * @param {{ recipes?: Record<string, Record<string, number>> }} [opts]
   */
  constructor(opts = {}) {
    this.recipes = opts.recipes || {};
    this.emotion = 'neutral';
    this.intensity = 0;
    this.prevEmotion = 'neutral';
    this.prevIntensity = 0;
    this.stepOutT = 0;
    this.stepOutDur = 0;
    this.stepOutBefore = false;
    this.attackT = 0;
    this.attackDur = 0;
    this.blinkAge = -1;
    this.blinkDur = getEmotionTiming('neutral').blinkDurationSec || 0.16;
    this.nextBlinkIn = blinkIntervalSec('neutral');
    /** @type {ReturnType<typeof planMicroLeak> | null} */
    this.leak = null;
    this.leakAgeMs = 0;
    this.moodEmotion = null;
    this.moodIntensity = 0;
    this.tense = false;
    this.speaking = false;
  }

  /**
   * Request emotion change with optional Step-Out.
   * @param {string} emotion
   * @param {number} intensity
   * @param {{ stepOutBefore?: boolean, skipAttack?: boolean }} [opts]
   */
  setEmotion(emotion, intensity, opts = {}) {
    const stepOutBefore = opts.stepOutBefore === true;
    const changed = emotion !== this.emotion || stepOutBefore;
    if (changed) {
      this.prevEmotion = this.emotion;
      this.prevIntensity = this.intensity;
      this.stepOutBefore = stepOutBefore;
      const prevTiming = getEmotionTiming(this.prevEmotion);
      this.stepOutDur = prevTiming.stepOutSec ?? STEP_OUT_DURATION[this.prevEmotion] ?? 0.5;
      this.stepOutT = 0;
    }
    this.emotion = emotion;
    this.intensity = intensity;
    if (changed && !opts.skipAttack) {
      const timing = getEmotionTiming(emotion);
      this.attackDur = timing.attackSec ?? ATTACK_DURATION[emotion] ?? 0.35;
      this.attackT = 0;
    } else if (!changed) {
      // intensity-only update keeps current attack progress
    }
    this.nextBlinkIn = blinkIntervalSec(emotion, {
      tense: this.tense,
      speaking: this.speaking,
    });

    // Chance to schedule a leak from mood or when masking
    if (this.moodEmotion && this.moodEmotion !== emotion) {
      const plan = planMicroLeak({
        suppressedEmotion: this.moodEmotion,
        surfaceEmotion: emotion,
        suppressedIntensity: this.moodIntensity,
      });
      if (Math.random() < plan.probability * 0.35) {
        this.leak = plan;
        this.leakAgeMs = 0;
      }
    }
  }

  /**
   * @param {string | null} moodEmotion
   * @param {number} moodIntensity
   */
  setMood(moodEmotion, moodIntensity = 0.35) {
    this.moodEmotion = moodEmotion;
    this.moodIntensity = moodIntensity;
  }

  /**
   * Force a blink now.
   */
  forceBlink() {
    this.blinkAge = 0;
  }

  /**
   * Force a micro-leak event.
   * @param {string} suppressedEmotion
   */
  forceLeak(suppressedEmotion) {
    this.leak = planMicroLeak({
      suppressedEmotion,
      surfaceEmotion: this.emotion,
      suppressedIntensity: Math.max(this.moodIntensity, 0.55),
    });
    this.leak.probability = 1;
    this.leakAgeMs = 0;
  }

  /**
   * Advance simulation.
   * @param {number} dt seconds
   * @returns {{
   *   blink: number,
   *   stepOutWeight: number,
   *   displayEmotion: string,
   *   displayIntensity: number,
   *   residualEmotion: string | null,
   *   residualIntensity: number,
   *   leakWeights: Record<string, number>,
   *   events: object[],
   * }}
   */
  tick(dt) {
    const events = [];

    // Step-Out residual
    let stepOutWeight = 0;
    let residualEmotion = null;
    let residualIntensity = 0;
    if (this.stepOutDur > 0 && this.stepOutT < this.stepOutDur) {
      this.stepOutT += dt;
      stepOutWeight = stepOutCurve(this.stepOutT, this.stepOutDur);
      residualEmotion = this.prevEmotion;
      residualIntensity = this.prevIntensity * stepOutWeight;
      if (this.stepOutBefore && stepOutWeight > 0.05) {
        // hold new emotion low until mostly cleared
      }
    }

    // Attack ramp (capture-authored onset→apex)
    let attackWeight = 1;
    if (this.attackDur > 0 && this.attackT < this.attackDur) {
      this.attackT += dt;
      attackWeight = attackCurve(this.attackT, this.attackDur);
    }

    let displayEmotion = this.emotion;
    let displayIntensity = this.intensity * attackWeight;
    if (this.stepOutBefore && stepOutWeight > 0.2) {
      displayIntensity = this.intensity * attackWeight * (1 - stepOutWeight);
    }

    // Blink
    let blink = 0;
    if (this.blinkAge >= 0) {
      this.blinkAge += dt;
      blink = blinkEnvelope(this.blinkAge, this.blinkDur);
      if (this.blinkAge >= this.blinkDur) {
        this.blinkAge = -1;
        this.nextBlinkIn = blinkIntervalSec(this.emotion, {
          tense: this.tense,
          speaking: this.speaking,
        });
        events.push({ eventType: 'blink', timestamp: performanceNow() });
      }
    } else {
      this.nextBlinkIn -= dt;
      if (this.nextBlinkIn <= 0) {
        this.blinkAge = 0;
        const timing = getEmotionTiming(this.emotion);
        const baseDur = timing.blinkDurationSec || 0.16;
        // fear/surprise: occasional double blink burst
        if (this.emotion === 'fear' || this.emotion === 'surprised') {
          this.blinkDur = Math.min(baseDur, 0.12);
        } else {
          this.blinkDur = baseDur * (0.9 + Math.random() * 0.25);
        }
      }
    }

    // Leak
    /** @type {Record<string, number>} */
    let leakWeights = {};
    if (this.leak) {
      this.leakAgeMs += dt * 1000;
      leakWeights = evaluateMicroLeak(this.leak, this.leakAgeMs, this.recipes);
      if (this.leakAgeMs >= this.leak.phases.endMs) {
        events.push({
          eventType: 'microLeak',
          region: this.leak.region,
          durationMs: this.leak.durationMs,
          timestamp: performanceNow(),
        });
        this.leak = null;
        this.leakAgeMs = 0;
      }
    } else if (this.moodEmotion && Math.random() < dt * 0.08 * (LEAK_BIAS[this.moodEmotion] || 0.2)) {
      // rare passive mood leak
      this.forceLeak(this.moodEmotion);
    }

    const raw = {
      blink,
      stepOutWeight,
      attackWeight,
      displayEmotion,
      displayIntensity,
      residualEmotion,
      residualIntensity,
      leakWeights,
      events,
    };

    return applyComplianceGate(raw, {});
  }
}

function performanceNow() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}
