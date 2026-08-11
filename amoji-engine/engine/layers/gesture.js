/**
 * Layer G — Ekman–Friesen gesture stack.
 * Priority: Emblem (LOCKED) > Illustrator/Regulator (CLAMPED) > Affect (OPEN) > Adaptor (gap fill).
 */
import catalog from '../../data/gestures/catalog.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const GESTURE_PRIORITY = catalog.priority;
export const GESTURE_EMBLEMS = catalog.emblems;
export const GESTURE_ILLUSTRATORS = catalog.illustrators;
export const GESTURE_REGULATORS = catalog.regulators;
export const GESTURE_AFFECT = catalog.affectByEmotion;
export const GESTURE_ADAPTORS = catalog.adaptorDefs;
export const GESTURE_POSES = catalog.poses;
export const GAP_SEC_FOR_ADAPTOR = catalog.gapSecForAdaptor;

const BONE_KEYS = [
  'upperarm_L',
  'lowerarm_L',
  'hand_L',
  'upperarm_R',
  'lowerarm_R',
  'hand_R',
];

/**
 * @param {string} poseId
 * @returns {Record<string, unknown> | null}
 */
export function getPose(poseId) {
  return GESTURE_POSES[poseId] || null;
}

/**
 * Soften / sharpen a pose by amplitude (Illustrator CLAMPED emotion tweak).
 * @param {Record<string, unknown>} pose
 * @param {number} amplitude 0..1.5
 */
export function scalePose(pose, amplitude = 1) {
  const a = Math.max(0, Math.min(1.5, amplitude));
  /** @type {Record<string, unknown>} */
  const out = { ...pose };
  for (const key of BONE_KEYS) {
    const v = pose[key];
    if (Array.isArray(v)) {
      out[key] = v.map((n) => Number(n) * a);
    }
  }
  if (typeof pose.fist === 'number') out.fist = Math.min(1, Number(pose.fist) * a);
  if (typeof pose.handOpen === 'number') {
    out.handOpen = Math.min(1, Number(pose.handOpen) * (0.35 + a * 0.65));
  }
  return out;
}

/**
 * Emotion may bias Emblem speed/force only — never rewrite emblem semantics.
 * @param {string} emotion
 */
export function emblemSpeedBias(emotion) {
  return catalog.emblemEmotionSpeedBias[emotion] ?? 1;
}

/**
 * Map mood / anxiety → adaptor pool.
 * @param {string} [mood]
 * @param {number} [anxiety]
 */
export function adaptorPoolForMood(mood, anxiety = 0) {
  const m = mood || 'default';
  if (anxiety > 0.55 && catalog.adaptorsByMood.anxious) {
    return catalog.adaptorsByMood.anxious;
  }
  return catalog.adaptorsByMood[m] || catalog.adaptorsByMood.default;
}

/**
 * Pick an adaptor id for mood (deterministic when seed provided).
 * @param {string} [mood]
 * @param {{ anxiety?: number, seed?: number, preferred?: string }} [opts]
 */
export function pickAdaptor(mood, opts = {}) {
  if (opts.preferred && GESTURE_ADAPTORS[opts.preferred]) return opts.preferred;
  const pool = adaptorPoolForMood(mood, opts.anxiety ?? 0);
  if (!pool.length) return 'fingerTap';
  const i =
    typeof opts.seed === 'number'
      ? Math.abs(Math.floor(opts.seed)) % pool.length
      : Math.floor(Math.random() * pool.length);
  return pool[i];
}

/**
 * Resolve which layer wins given current script / speech / turn / gap state.
 * @param {{
 *   emblem?: string | null,
 *   speaking?: boolean,
 *   speechStress?: number,
 *   turnState?: 'none'|'nod'|'hurry'|'pause'|'waiting'|null,
 *   emotion?: string,
 *   intensity?: number,
 *   mood?: string,
 *   anxiety?: number,
 *   gapSec?: number,
 *   latencyAdaptor?: string | null,
 * }} input
 */
export function resolveGestureLayer(input = {}) {
  const emotion = input.emotion || 'neutral';
  const intensity = Math.max(0, Math.min(1.25, input.intensity ?? 0.7));

  if (input.emblem && GESTURE_EMBLEMS[input.emblem]) {
    const def = GESTURE_EMBLEMS[input.emblem];
    return {
      layer: 'emblem',
      lock: 'LOCKED',
      id: input.emblem,
      label: def.label,
      poseId: def.pose,
      hand: def.hand,
      speed: emblemSpeedBias(emotion),
      amplitude: 1,
      pose: getPose(def.pose),
    };
  }

  const turn = input.turnState;
  if (turn && turn !== 'none') {
    const key =
      turn === 'hurry'
        ? 'hurryCircle'
        : turn === 'pause'
          ? 'pausePalm'
          : turn === 'waiting'
            ? 'waiting'
            : turn === 'nod'
              ? 'nod'
              : null;
    if (key && GESTURE_REGULATORS[key]) {
      const def = GESTURE_REGULATORS[key];
      const sharp = emotion === 'angry' ? 1.25 : emotion === 'happy' ? 0.9 : 1;
      return {
        layer: 'regulator',
        lock: 'CLAMPED',
        id: key,
        label: def.label,
        poseId: def.pose,
        hand: def.hand,
        speed: sharp,
        amplitude: 0.85 * Math.min(1, 0.5 + intensity * 0.5),
        pose: scalePose(getPose(def.pose) || GESTURE_POSES.rest, sharp * 0.85),
      };
    }
  }

  if (input.speaking) {
    const def = GESTURE_ILLUSTRATORS.beat;
    const stress = Math.max(0, Math.min(1, input.speechStress ?? 0.5));
    // Emotion clamps amplitude / sharpness only — beat shape stays.
    let sharp = 1;
    if (emotion === 'angry') sharp = 1.35;
    else if (emotion === 'happy' || emotion === 'smile_open') sharp = 0.85;
    else if (emotion === 'sad') sharp = 0.65;
    else if (emotion === 'fear') sharp = 1.15;
    const amp =
      (def.baseAmplitude + stress * 0.45) *
      sharp *
      Math.min(1.1, 0.4 + intensity * 0.7);
    return {
      layer: 'illustrator',
      lock: 'CLAMPED',
      id: 'beat',
      label: def.label,
      poseId: def.pose,
      hand: def.hand,
      speed: sharp,
      amplitude: amp,
      pose: scalePose(getPose(def.pose) || GESTURE_POSES.rest, amp),
    };
  }

  const affect = GESTURE_AFFECT[emotion] || GESTURE_AFFECT.neutral;
  const affectAmp = (affect.amplitude ?? 0.6) * Math.min(1, intensity);
  if (affectAmp >= 0.18) {
    return {
      layer: 'affect',
      lock: 'OPEN',
      id: emotion,
      label: `Affect · ${emotion}`,
      poseId: affect.pose,
      hand: affect.hand,
      speed: 1,
      amplitude: affectAmp,
      pose: scalePose(getPose(affect.pose) || GESTURE_POSES.rest, affectAmp),
    };
  }

  const gap = input.gapSec ?? 0;
  if (gap >= GAP_SEC_FOR_ADAPTOR || input.latencyAdaptor) {
    const adaptorId = pickAdaptor(input.mood || emotion, {
      anxiety: input.anxiety,
      preferred: input.latencyAdaptor || undefined,
      seed: Math.floor(gap * 10),
    });
    const def = GESTURE_ADAPTORS[adaptorId] || GESTURE_ADAPTORS.fingerTap;
    const anx = Math.max(0, Math.min(1, input.anxiety ?? 0.35));
    return {
      layer: 'adaptor',
      lock: 'OPEN',
      id: adaptorId,
      label: def.label,
      poseId: def.pose,
      hand: def.hand,
      speed: 0.85 + anx * 0.3,
      amplitude: 0.45 + anx * 0.4,
      pose: scalePose(getPose(def.pose) || GESTURE_POSES.rest, 0.45 + anx * 0.4),
      holdSec: def.holdSec,
    };
  }

  return {
    layer: 'rest',
    lock: 'OPEN',
    id: 'rest',
    label: 'Rest',
    poseId: 'rest',
    hand: 'both',
    speed: 1,
    amplitude: 0.15,
    pose: scalePose(GESTURE_POSES.rest, 0.15),
  };
}

/**
 * Sample animated offsets (wave / beat phase) on top of a resolved pose.
 * @param {ReturnType<typeof resolveGestureLayer>} resolved
 * @param {number} timeSec
 */
export function sampleGesturePose(resolved, timeSec = 0) {
  const pose = { ...(resolved.pose || GESTURE_POSES.rest) };
  const speed = resolved.speed || 1;
  const t = timeSec * speed;
  /** @type {Record<string, number[]>} */
  const bones = {};
  for (const key of BONE_KEYS) {
    const v = pose[key];
    bones[key] = Array.isArray(v) ? v.map(Number) : [0, 0, 0];
  }

  if (pose.wavePhase) {
    const w = Math.sin(t * Math.PI * 2 * 1.6) * 0.35 * (resolved.amplitude || 1);
    bones.hand_R[1] += w;
    bones.lowerarm_R[2] += w * 0.4;
  }
  if (pose.beatPhase) {
    const b = Math.abs(Math.sin(t * Math.PI * 2 * 2.2)) * 0.28 * (resolved.amplitude || 1);
    bones.lowerarm_R[0] -= b;
    bones.hand_R[0] += b * 0.3;
  }

  return applyComplianceGate(
    {
      kind: 'gesture_pose',
      layer: resolved.layer,
      lock: resolved.lock,
      id: resolved.id,
      label: resolved.label,
      bones,
      fist: Number(pose.fist ?? 0),
      handOpen: Number(pose.handOpen ?? 0.35),
      speed,
      amplitude: resolved.amplitude,
    },
    {},
  );
}

/**
 * Stateful controller — tracks speech gap for Adaptor trigger.
 */
export class GestureController {
  /**
   * @param {{
   *   emblem?: string | null,
   *   speaking?: boolean,
   *   speechStress?: number,
   *   turnState?: string | null,
   *   mood?: string,
   *   anxiety?: number,
   * }} [opts]
   */
  constructor(opts = {}) {
    this.emblem = opts.emblem ?? null;
    this.speaking = opts.speaking ?? false;
    this.speechStress = opts.speechStress ?? 0.5;
    this.turnState = opts.turnState ?? null;
    this.mood = opts.mood ?? null;
    this.anxiety = opts.anxiety ?? 0.3;
    this.latencyAdaptor = null;
    this.gapSec = 0;
    this.time = 0;
    this._emblemT = 0;
  }

  /** @param {string | null} id */
  setEmblem(id) {
    this.emblem = id && GESTURE_EMBLEMS[id] ? id : null;
    this._emblemT = 0;
    if (this.emblem) this.gapSec = 0;
  }

  /** @param {boolean} on @param {number} [stress] */
  setSpeaking(on, stress) {
    this.speaking = !!on;
    if (typeof stress === 'number') this.speechStress = stress;
    if (on) this.gapSec = 0;
  }

  /** @param {string | null} state */
  setTurnState(state) {
    this.turnState = state;
    if (state && state !== 'none') this.gapSec = 0;
  }

  /**
   * Fire a one-shot emblem that auto-clears after catalog duration.
   * @param {string} id
   */
  playEmblem(id) {
    this.setEmblem(id);
  }

  /**
   * @param {number} dt
   * @param {{ emotion?: string, intensity?: number, mood?: string, anxiety?: number, latencyAdaptor?: string | null }} [ctx]
   */
  tick(dt, ctx = {}) {
    this.time += dt;
    if (ctx.mood != null) this.mood = ctx.mood;
    if (typeof ctx.anxiety === 'number') this.anxiety = ctx.anxiety;
    if (ctx.latencyAdaptor !== undefined) this.latencyAdaptor = ctx.latencyAdaptor;

    const emotion = ctx.emotion || 'neutral';
    const intensity = ctx.intensity ?? 0.7;

    // Auto-clear timed emblems
    if (this.emblem && GESTURE_EMBLEMS[this.emblem]) {
      this._emblemT += dt;
      const dur = GESTURE_EMBLEMS[this.emblem].durationSec || 1.2;
      if (this._emblemT >= dur / Math.max(0.5, emblemSpeedBias(emotion))) {
        this.emblem = null;
        this._emblemT = 0;
      }
    }

    const higherActive =
      !!this.emblem ||
      this.speaking ||
      (this.turnState && this.turnState !== 'none');
    if (higherActive) this.gapSec = 0;
    else this.gapSec += dt;

    const resolved = resolveGestureLayer({
      emblem: this.emblem,
      speaking: this.speaking,
      speechStress: this.speechStress,
      turnState: this.turnState,
      emotion,
      intensity,
      mood: this.mood || emotion,
      anxiety: this.anxiety,
      gapSec: this.gapSec,
      latencyAdaptor: this.latencyAdaptor,
    });

    const sampled = sampleGesturePose(resolved, this.time);
    return {
      ...sampled,
      gapSec: this.gapSec,
      emblem: this.emblem,
      speaking: this.speaking,
      turnState: this.turnState,
    };
  }
}

/**
 * Apply sampled gesture bones onto a Three.js Object3D hierarchy (by node name).
 * Rest poses should be captured once after load.
 *
 * @param {Record<string, { rotation: { x: number, y: number, z: number } }>} boneMap
 * @param {Record<string, { x: number, y: number, z: number }>} restRotations
 * @param {ReturnType<typeof sampleGesturePose>} sample
 * @param {number} [alpha=1]
 */
export function applyGestureBones(boneMap, restRotations, sample, alpha = 1) {
  const a = Math.max(0, Math.min(1, alpha));
  for (const key of BONE_KEYS) {
    const bone = boneMap[key];
    const rest = restRotations[key];
    if (!bone || !rest) continue;
    const delta = sample.bones?.[key] || [0, 0, 0];
    bone.rotation.x = rest.x + delta[0] * a;
    bone.rotation.y = rest.y + delta[1] * a;
    bone.rotation.z = rest.z + delta[2] * a;
  }
}
