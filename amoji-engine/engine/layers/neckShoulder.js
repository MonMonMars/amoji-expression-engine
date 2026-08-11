/**
 * Layer B — Neck / shoulder / breathing (Alba Emoting body effector).
 * Unified by accessoryMuscleActivation (SCM/scalenes dual role).
 */
import bodyData from '../../data/body/emotion-neck-shoulder.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const BODY_NEUTRAL = bodyData.neutral;
export const BODY_BY_EMOTION = bodyData.byEmotion;
export const THREAT_FREEZE = bodyData.threatFreeze;
export const GAZE_COMBO = bodyData.gazeCombo;

/**
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Cross-layer read: head pitch × gaze lock → affective label.
 * @param {number} headTiltVertical -1..1
 * @param {{ lookX?: number, lookY?: number, gazeLock?: number }} gaze
 * @returns {'angry_challenge'|'sad_submissive'|'proud'|'neutral'}
 */
export function classifyHeadGazeCombo(headTiltVertical, gaze = {}) {
  const pitch = headTiltVertical ?? 0;
  const lock =
    typeof gaze.gazeLock === 'number'
      ? gaze.gazeLock
      : 1 - Math.min(1, Math.hypot(gaze.lookX ?? 0, gaze.lookY ?? 0));
  const avoid = 1 - lock;

  if (pitch < -0.15) {
    if (lock >= GAZE_COMBO.angryGazeLockThreshold) return 'angry_challenge';
    if (avoid >= GAZE_COMBO.avoidThreshold) return 'sad_submissive';
  }
  if (pitch > 0.2 && lock >= 0.4) return 'proud';
  return 'neutral';
}

/**
 * Evaluate Layer B for emotion (+ optional gaze for angry lock rule).
 * @param {string} emotion
 * @param {number} [intensity=1]
 * @param {{
 *   lookX?: number,
 *   lookY?: number,
 *   gazeLock?: number,
 *   threat?: boolean,
 *   sigh?: boolean,
 * }} [opts]
 */
export function evaluateBody(emotion, intensity = 1, opts = {}) {
  const base = { ...BODY_NEUTRAL };
  let emoKey = emotion;
  const raw = BODY_BY_EMOTION[emotion] || BODY_BY_EMOTION.neutral;
  const t = Math.max(0, Math.min(1.25, intensity));
  const mix = Math.min(1, t);

  /** @type {Record<string, unknown>} */
  let target = { ...raw };

  // Angry head-down only reads as anger when gaze is locked; else remap toward sad.
  if (raw.requiresGazeLock) {
    const combo = classifyHeadGazeCombo(
      lerp(base.headTiltVertical, raw.headTiltVertical, mix),
      opts,
    );
    if (combo === 'sad_submissive') {
      emoKey = 'sad';
      target = { ...BODY_BY_EMOTION.sad };
    }
  }

  const body = {
    headTiltLateral: lerp(base.headTiltLateral, target.headTiltLateral ?? 0, mix),
    headTiltVertical: lerp(base.headTiltVertical, target.headTiltVertical ?? 0, mix),
    headTiltSpeed: mix > 0.25 ? target.headTiltSpeed || base.headTiltSpeed : base.headTiltSpeed,
    shoulderRoundness: lerp(base.shoulderRoundness, target.shoulderRoundness ?? 0, mix),
    chestExpansion: lerp(base.chestExpansion, target.chestExpansion ?? 0, mix),
    accessoryMuscleActivation: lerp(
      base.accessoryMuscleActivation,
      target.accessoryMuscleActivation ?? 0,
      mix,
    ),
    breathingRate: lerp(base.breathingRate, target.breathingRate ?? 1, mix),
    breathingDepth: mix > 0.3 ? target.breathingDepth || base.breathingDepth : base.breathingDepth,
    breathingRegularity:
      mix > 0.3
        ? target.breathingRegularity || base.breathingRegularity
        : base.breathingRegularity,
    inhaleBias: lerp(base.inhaleBias, target.inhaleBias ?? 0.5, mix),
  };

  if (opts.sigh) {
    body.accessoryMuscleActivation = Math.min(1, body.accessoryMuscleActivation + 0.45);
    body.inhaleBias = Math.min(0.35, body.inhaleBias * 0.6);
    body.breathingDepth = 'deep';
  }

  if (opts.threat) {
    body.accessoryMuscleActivation = Math.min(
      1,
      body.accessoryMuscleActivation + THREAT_FREEZE.accessoryBoost,
    );
  }

  // Derived (document 18)
  const ama = body.accessoryMuscleActivation;
  const derived = {
    neckVisibleTension: ama,
    shoulderMicroLift: ama * body.breathingRate,
    breathingMode: ama > 0.5 ? 'accessory' : 'diaphragm',
    // Trapezium coupling: head-down pulls static shoulder height up a bit
    shoulderHeight: Math.max(0, Math.min(1, ama * 0.85 + Math.max(0, -body.headTiltVertical) * 0.25)),
  };

  const gazeLabel = classifyHeadGazeCombo(body.headTiltVertical, opts);

  return applyComplianceGate(
    {
      kind: 'body',
      emotion: emoKey,
      intensity: t,
      body: { ...body, ...derived },
      gazeCombo: gazeLabel,
      note:
        gazeLabel === 'angry_challenge'
          ? 'head-down + gaze lock → anger'
          : gazeLabel === 'sad_submissive'
            ? 'head-down + gaze avoid → sad/submissive'
            : null,
    },
    {},
  );
}

/**
 * Sample breath + posture channels for animation (seconds).
 * @param {ReturnType<typeof evaluateBody>['body']} body
 * @param {number} timeSec
 * @param {{ threatFreezeT?: number }} [opts] remaining freeze seconds
 */
export function sampleBodyPose(body, timeSec, opts = {}) {
  const rate = body.breathingRate || 1;
  const depthMul =
    body.breathingDepth === 'deep' ? 1.25 : body.breathingDepth === 'shallow' ? 0.55 : 1;
  let phase = timeSec * rate * Math.PI * 2 * 0.35; // ~21 bpm at rate 1
  if (body.breathingRegularity === 'irregular') {
    phase += Math.sin(timeSec * 3.1) * 0.35 + Math.sin(timeSec * 5.7) * 0.15;
  } else if (body.breathingRegularity === 'held') {
    phase = Math.min(phase % (Math.PI * 2), Math.PI * 0.9);
  }

  // Asymmetric inhale/exhale via inhaleBias
  const bias = body.inhaleBias ?? 0.5;
  const cycle = ((phase / (Math.PI * 2)) % 1 + 1) % 1;
  const inhale = cycle < bias;
  const local = inhale ? cycle / Math.max(bias, 1e-3) : (cycle - bias) / Math.max(1 - bias, 1e-3);
  const breathWave = inhale
    ? Math.sin(local * Math.PI * 0.5)
    : Math.cos(local * Math.PI * 0.5);

  const chest = breathWave * 0.04 * depthMul * (0.5 + Math.abs(body.chestExpansion));
  const shoulderBreath =
    breathWave * 0.012 * (body.shoulderMicroLift || 0) * (body.breathingMode === 'accessory' ? 1.4 : 0.6);

  let swayMul = 1;
  if ((opts.threatFreezeT ?? 0) > 0) {
    swayMul = THREAT_FREEZE.swayMul;
  }

  return {
    headPitch: body.headTiltVertical * 0.35,
    headRoll: body.headTiltLateral * 0.4,
    neckPitch: body.headTiltVertical * 0.12 + body.neckVisibleTension * 0.04,
    clavicleLift: body.shoulderHeight * 0.18 + shoulderBreath,
    clavicleRound: body.shoulderRoundness * 0.12,
    chestScale: 1 + chest + body.chestExpansion * 0.03,
    spineBend: -body.shoulderRoundness * 0.08 + (body.chestExpansion < 0 ? body.chestExpansion * 0.06 : 0),
    swayMul,
    breathWave,
  };
}

/**
 * Apply Layer B sample onto Sakura bones (head/neck/spine/clavicle).
 * @param {Record<string, { rotation: { x: number, y: number, z: number }, scale?: { setScalar?: Function, x?: number, y?: number, z?: number } }>} boneMap
 * @param {Record<string, { x: number, y: number, z: number }>} restRotations
 * @param {ReturnType<typeof sampleBodyPose>} sample
 * @param {number} [alpha=1]
 */
export function applyBodyBones(boneMap, restRotations, sample, alpha = 1) {
  const a = Math.max(0, Math.min(1, alpha));
  const set = (name, dx, dy, dz) => {
    const bone = boneMap[name];
    const rest = restRotations[name];
    if (!bone || !rest) return;
    bone.rotation.x = rest.x + dx * a;
    bone.rotation.y = rest.y + dy * a;
    bone.rotation.z = rest.z + dz * a;
  };

  set('head', sample.headPitch, 0, sample.headRoll);
  set('neck', sample.neckPitch, 0, sample.headRoll * 0.35);
  set('spine03', sample.spineBend, 0, 0);
  set('clavicle_L', -sample.clavicleLift, sample.clavicleRound, sample.clavicleLift * 0.5);
  set('clavicle_R', -sample.clavicleLift, -sample.clavicleRound, -sample.clavicleLift * 0.5);

  const spine = boneMap.spine02;
  if (spine?.scale?.setScalar) {
    spine.scale.setScalar(sample.chestScale);
  }
}

/**
 * Stateful Layer B with threat freeze timer + paralinguistic hooks.
 */
export class BodyController {
  constructor() {
    this.threatFreezeT = 0;
    this.sighT = 0;
    this.time = 0;
  }

  /** Sudden threat — freeze sway briefly. */
  triggerThreat() {
    this.threatFreezeT = THREAT_FREEZE.durationSec;
  }

  /** Paralinguistic sigh tag from TTS. */
  triggerSigh() {
    this.sighT = 1.2;
  }

  /**
   * @param {number} dt
   * @param {{ emotion: string, intensity?: number, lookX?: number, lookY?: number, gazeLock?: number }} ctx
   */
  tick(dt, ctx) {
    this.time += dt;
    if (this.threatFreezeT > 0) this.threatFreezeT = Math.max(0, this.threatFreezeT - dt);
    if (this.sighT > 0) this.sighT = Math.max(0, this.sighT - dt);

    const evaluated = evaluateBody(ctx.emotion, ctx.intensity ?? 0.7, {
      lookX: ctx.lookX,
      lookY: ctx.lookY,
      gazeLock: ctx.gazeLock,
      threat: this.threatFreezeT > 0,
      sigh: this.sighT > 0,
    });
    const pose = sampleBodyPose(evaluated.body, this.time, {
      threatFreezeT: this.threatFreezeT,
    });
    return { ...evaluated, pose, threatFreezeT: this.threatFreezeT, sighT: this.sighT };
  }
}
