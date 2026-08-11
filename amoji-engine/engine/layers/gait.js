/**
 * Layer W — Emotion-driven gait parameters (Johansson / affect gait literature).
 */
import gaitData from '../../data/gait/emotion-gait.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const GAIT_NEUTRAL = gaitData.neutral;
export const GAIT_BY_EMOTION = gaitData.byEmotion;

/**
 * @param {string} emotion
 * @param {number} [intensity=1]
 * @param {{ pathBias?: number }} [opts] pathBias from gaze approach/avoid (-1..1 → directness)
 */
export function evaluateGait(emotion, intensity = 1, opts = {}) {
  const base = { ...GAIT_NEUTRAL };
  const emo = GAIT_BY_EMOTION[emotion] || GAIT_BY_EMOTION.thinking || base;
  const t = Math.max(0, Math.min(1.25, intensity));
  const mix = Math.min(1, t);

  /** @param {number} a @param {number} b */
  const lerp = (a, b) => a + (b - a) * mix;

  const gait = {
    walkSpeed: lerp(base.walkSpeed, emo.walkSpeed ?? base.walkSpeed),
    strideLength: lerp(base.strideLength, emo.strideLength ?? base.strideLength),
    cadence: lerp(base.cadence, emo.cadence ?? base.cadence),
    armSwingAmplitude: lerp(
      base.armSwingAmplitude,
      emo.armSwingAmplitude ?? base.armSwingAmplitude,
    ),
    armSwingOrigin: mix > 0.35 ? emo.armSwingOrigin || base.armSwingOrigin : base.armSwingOrigin,
    verticalBounce: lerp(base.verticalBounce, emo.verticalBounce ?? base.verticalBounce),
    footstepWeight: mix > 0.35 ? emo.footstepWeight || base.footstepWeight : base.footstepWeight,
    pathDirectness: lerp(base.pathDirectness, emo.pathDirectness ?? base.pathDirectness),
  };

  if (typeof opts.pathBias === 'number') {
    // approach → more direct; avoid → less
    gait.pathDirectness = Math.max(
      0.4,
      Math.min(1.3, gait.pathDirectness + opts.pathBias * 0.2),
    );
  }

  // Fear signature: short strides + high cadence even if speed ~1
  if (emotion === 'fear' && mix > 0.2) {
    gait.armSwingOrigin = 'elbow';
  }

  return applyComplianceGate(
    {
      kind: 'gait',
      emotion,
      intensity: t,
      gait,
      note:
        emotion === 'angry'
          ? 'anger needs Layer B/G — gait alone is weak'
          : emotion === 'fear'
            ? 'distal (elbow) arm swing'
            : null,
    },
    {},
  );
}

/**
 * Sample a simple walk cycle pose (normalized 0..1 phase) for debug / Face Live proxy.
 * @param {ReturnType<typeof evaluateGait>['gait']} gait
 * @param {number} phase 0..1
 */
export function sampleWalkPose(gait, phase) {
  const p = phase % 1;
  const swing = Math.sin(p * Math.PI * 2) * gait.armSwingAmplitude;
  return {
    pelvisYaw: Math.sin(p * Math.PI * 2) * 0.04 * gait.strideLength,
    vertical: Math.abs(Math.sin(p * Math.PI * 2)) * 0.02 * gait.verticalBounce,
    armL: swing * (gait.armSwingOrigin === 'elbow' ? 0.55 : 1),
    armR: -swing * (gait.armSwingOrigin === 'elbow' ? 0.55 : 1),
    stepSpeed: gait.walkSpeed * gait.cadence,
  };
}
