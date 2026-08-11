/**
 * Robot driver packs — map Amoji semantic performance → hardware joint commands.
 * Surface Level 10 path. Always compliance-gated. Pure generation only.
 */
import catalog from '../../data/robots/catalog.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { evaluateEmotion } from '../layers/emotionFormulas.js';
import { resolveMouth } from '../layers/resolveMouth.js';
import { evaluateBody, sampleBodyPose } from '../layers/neckShoulder.js';
import { evaluateGait, sampleWalkPose } from '../layers/gait.js';
import {
  calibrateRawJoints,
  getChassis,
  resolvePackForChassis,
  ChassisSlewLimiter,
  DEFAULT_CHASSIS,
} from './chassisCalibrate.js';

export const ROBOT_CATALOG = catalog;
export const ROBOT_PACKS = catalog.packs;
export const DEFAULT_ROBOT_PACK = catalog.defaultPack;
export const ROBOT_PROTOCOL = 'json-joints-v1';

/**
 * @param {string} [packId]
 */
export function getRobotPack(packId) {
  const id = packId || DEFAULT_ROBOT_PACK;
  const pack = ROBOT_PACKS[id];
  if (!pack) return null;
  return resolvePackJoints(pack);
}

/**
 * Merge `extends` chain so child packs inherit parent joints.
 * @param {object} pack
 */
function resolvePackJoints(pack) {
  /** @type {Record<string, object>} */
  let joints = {};
  const seen = new Set();
  let cur = pack;
  const chain = [];
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id);
    chain.unshift(cur);
    cur = cur.extends ? ROBOT_PACKS[cur.extends] : null;
  }
  for (const p of chain) {
    joints = { ...joints, ...(p.joints || {}) };
  }
  return {
    ...pack,
    joints,
    dof: Object.keys(joints).length,
  };
}

/**
 * @returns {Array<{ id: string, label: string, dof: number, productLine: string }>}
 */
export function listRobotPacks() {
  return Object.values(ROBOT_PACKS).map((p) => {
    const resolved = resolvePackJoints(p);
    return {
      id: resolved.id,
      label: resolved.label,
      dof: resolved.dof,
      productLine: resolved.productLine,
      rateHz: resolved.rateHz,
      extends: resolved.extends || null,
    };
  });
}

/**
 * @param {number} v
 * @param {number} lo
 * @param {number} hi
 */
function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

/**
 * @param {object} jointSpec
 * @param {number} raw
 */
function clampJoint(jointSpec, raw) {
  const v = Number(raw);
  if (Number.isNaN(v)) return jointSpec.rest ?? 0;
  return clamp(v, jointSpec.min, jointSpec.max);
}

/**
 * Emotion → face servo hints (norm space).
 * @param {string} emotion
 * @param {number} intensity
 */
export function emotionToFaceHints(emotion, intensity = 1) {
  const hints = catalog.emotionFaceHints[emotion] || catalog.emotionFaceHints.neutral;
  const t = Math.max(0, Math.min(1.25, intensity));
  /** @type {Record<string, number>} */
  const out = {};
  for (const [k, v] of Object.entries(hints)) {
    out[k] = Number(v) * Math.min(1, t);
  }
  return out;
}

/**
 * Build raw (unclamped) joint targets from a semantic frame.
 * @param {ReturnType<typeof getRobotPack>} pack
 * @param {{
 *   emotion?: string,
 *   intensity?: number,
 *   viseme?: string,
 *   mouth?: { jaw?: number, width?: number, corner?: number },
 *   lookX?: number,
 *   lookY?: number,
 *   blinkL?: number,
 *   blinkR?: number,
 *   pupil?: number,
 *   body?: object,
 *   pose?: object,
 *   gait?: object,
 *   walk?: object,
 *   gesture?: { armL?: object, armR?: object },
 * }} frame
 */
export function mapFrameToJoints(pack, frame = {}) {
  const emotion = frame.emotion || 'neutral';
  const intensity = frame.intensity ?? 1;
  const hints = emotionToFaceHints(emotion, intensity);
  /** @type {Record<string, number>} */
  const raw = {};

  // Rest pose for all joints first
  for (const [id, spec] of Object.entries(pack.joints)) {
    raw[id] = spec.rest ?? 0;
  }

  const has = (id) => id in pack.joints;

  // Face
  if (has('brow_L')) raw.brow_L = hints.brow ?? 0;
  if (has('brow_R')) raw.brow_R = hints.brow ?? 0;

  const blinkL = frame.blinkL ?? 0;
  const blinkR = frame.blinkR ?? blinkL;
  // lid: 0 open, 1 closed — fear/surprise pull lids open (negative hint)
  if (has('lid_L')) {
    const base = Math.max(0, hints.lid ?? 0);
    raw.lid_L = clamp(base + blinkL, 0, 1);
  }
  if (has('lid_R')) {
    const base = Math.max(0, hints.lid ?? 0);
    raw.lid_R = clamp(base + blinkR, 0, 1);
  }

  const lookX = frame.lookX ?? 0;
  const lookY = frame.lookY ?? 0;
  if (has('eye_pan_L')) raw.eye_pan_L = lookX;
  if (has('eye_pan_R')) raw.eye_pan_R = lookX;
  if (has('eye_tilt_L')) raw.eye_tilt_L = lookY;
  if (has('eye_tilt_R')) raw.eye_tilt_R = lookY;

  // Mouth — prefer resolved mouth / viseme path (params, not evaluateEmotion wrapper)
  let mouth = frame.mouth;
  if (!mouth) {
    const evaluated = evaluateEmotion(emotion, intensity);
    mouth = resolveMouth(frame.viseme || 'rest', evaluated.params || evaluated, intensity);
  }
  if (has('jaw')) {
    raw.jaw = mouth.jaw ?? hints.jaw ?? 0;
  }
  if (has('mouth_width')) {
    const w = mouth.width;
    raw.mouth_width = typeof w === 'number' && w > 0 ? w : hints.jaw != null ? 0.45 : 0.35;
  }
  // Corners: viseme may leave 0 on MBP — fall back to emotion smile/frown hints
  const cornerHint = hints.corner ?? 0;
  const corner =
    typeof mouth.corner === 'number' && Math.abs(mouth.corner) > 1e-4
      ? mouth.corner
      : cornerHint;
  if (has('mouth_corner_L')) raw.mouth_corner_L = corner;
  if (has('mouth_corner_R')) raw.mouth_corner_R = corner;

  // Body / neck (Layer B)
  const body = frame.body || {};
  const pose = frame.pose || {};
  if (has('neck_pitch')) {
    raw.neck_pitch = pose.headPitch ?? (body.headTiltVertical ?? 0) * 0.35;
  }
  if (has('neck_roll')) {
    raw.neck_roll = pose.headRoll ?? (body.headTiltLateral ?? 0) * 0.4;
  }
  if (has('neck_yaw')) {
    raw.neck_yaw = frame.lookX != null ? lookX * 0.25 : 0;
  }
  if (has('shoulder_L_lift')) {
    const lift = pose.clavicleLift ?? body.shoulderHeight ?? body.accessoryMuscleActivation ?? 0;
    raw.shoulder_L_lift = lift;
    if (has('shoulder_R_lift')) raw.shoulder_R_lift = lift;
  }
  if (has('shoulder_L_protract')) {
    const round = pose.clavicleRound ?? (body.shoulderRoundness ?? 0) * 0.12;
    raw.shoulder_L_protract = round;
    if (has('shoulder_R_protract')) raw.shoulder_R_protract = round;
  }
  if (has('spine_bend')) {
    raw.spine_bend = pose.spineBend ?? -(body.shoulderRoundness ?? 0) * 0.08;
  }

  // Arms from gesture sample (optional)
  const g = frame.gesture || {};
  const armL = g.armL || {};
  const armR = g.armR || {};
  if (has('elbow_L')) raw.elbow_L = armL.elbow ?? pack.joints.elbow_L.rest;
  if (has('elbow_R')) raw.elbow_R = armR.elbow ?? pack.joints.elbow_R.rest;
  if (has('wrist_L')) raw.wrist_L = armL.wrist ?? 0;
  if (has('wrist_R')) raw.wrist_R = armR.wrist ?? 0;

  // Hands (Layer G fist / handOpen → finger DOF)
  const fist = typeof g.fist === 'number' ? g.fist : typeof armR.fist === 'number' ? armR.fist : 0;
  const handOpen =
    typeof g.handOpen === 'number'
      ? g.handOpen
      : typeof armR.handOpen === 'number'
        ? armR.handOpen
        : 0.35;
  if (has('hand_L_fist')) raw.hand_L_fist = typeof armL.fist === 'number' ? armL.fist : fist;
  if (has('hand_R_fist')) raw.hand_R_fist = typeof armR.fist === 'number' ? armR.fist : fist;
  if (has('hand_L_open')) {
    raw.hand_L_open =
      typeof armL.handOpen === 'number' ? armL.handOpen : Math.max(0, handOpen * (1 - fist));
  }
  if (has('hand_R_open')) {
    raw.hand_R_open =
      typeof armR.handOpen === 'number' ? armR.handOpen : Math.max(0, handOpen * (1 - fist));
  }
  if (has('thumb_L')) {
    raw.thumb_L = typeof armL.thumb === 'number' ? armL.thumb : 0.2 + fist * 0.55;
  }
  if (has('thumb_R')) {
    raw.thumb_R = typeof armR.thumb === 'number' ? armR.thumb : 0.2 + fist * 0.55;
  }
  if (has('index_L')) {
    raw.index_L = typeof armL.index === 'number' ? armL.index : 0.15 + fist * 0.7;
  }
  if (has('index_R')) {
    raw.index_R = typeof armR.index === 'number' ? armR.index : 0.15 + fist * 0.7;
  }

  // Legs / gait (Layer W)
  const walk = frame.walk || {};
  if (has('hip_L')) raw.hip_L = walk.hipL ?? 0;
  if (has('hip_R')) raw.hip_R = walk.hipR ?? 0;
  if (has('knee_L')) raw.knee_L = walk.kneeL ?? pack.joints.knee_L?.rest ?? 0;
  if (has('knee_R')) raw.knee_R = walk.kneeR ?? pack.joints.knee_R?.rest ?? 0;
  if (has('ankle_L')) raw.ankle_L = walk.ankleL ?? 0;
  if (has('ankle_R')) raw.ankle_R = walk.ankleR ?? 0;
  if (has('pelvis_yaw')) raw.pelvis_yaw = walk.pelvisYaw ?? 0;

  return raw;
}

/**
 * Clamp raw joints to pack limits.
 * @param {ReturnType<typeof getRobotPack>} pack
 * @param {Record<string, number>} raw
 */
export function clampJoints(pack, raw) {
  /** @type {Record<string, { value: number, unit: string, min: number, max: number, region: string }>} */
  const joints = {};
  for (const [id, spec] of Object.entries(pack.joints)) {
    const value = clampJoint(spec, raw[id] ?? spec.rest ?? 0);
    joints[id] = {
      value: Number(value.toFixed(4)),
      unit: spec.unit,
      min: spec.min,
      max: spec.max,
      region: spec.region,
      speechLocked: !!spec.speechLocked,
    };
  }
  return joints;
}

/**
 * Compact nonzero dump for HUD.
 * @param {Record<string, { value: number }>} joints
 * @param {number} [eps=0.01]
 */
export function robotJointsNonZero(joints, eps = 0.01) {
  return Object.fromEntries(
    Object.entries(joints)
      .filter(([, j]) => Math.abs(j.value) > eps)
      .map(([id, j]) => [id, j.value])
      .sort((a, b) => Math.abs(/** @type {number} */ (b[1])) - Math.abs(/** @type {number} */ (a[1]))),
  );
}

/**
 * Drive one robot frame from semantic inputs.
 * @param {string} packId
 * @param {{
 *   emotion?: string,
 *   intensity?: number,
 *   viseme?: string,
 *   mouth?: object,
 *   lookX?: number,
 *   lookY?: number,
 *   blinkL?: number,
 *   blinkR?: number,
 *   timeSec?: number,
 *   walking?: boolean,
 *   gaitPhase?: number,
 *   gesture?: object,
 *   bodyOpts?: object,
 *   chassisId?: string,
 *   slew?: ChassisSlewLimiter | null,
 *   dtSec?: number,
 * }} [opts]
 */
export function driveRobot(packId, opts = {}) {
  const chassisId = opts.chassisId || null;
  const resolvedPackId = resolvePackForChassis(packId, chassisId) || packId;
  const pack = getRobotPack(resolvedPackId);
  if (!pack) {
    return applyComplianceGate(
      { kind: 'robot_driver', error: 'unknown_pack', packId: resolvedPackId },
      {},
    );
  }
  if (chassisId && !getChassis(chassisId)) {
    return applyComplianceGate(
      { kind: 'robot_driver', error: 'unknown_chassis', chassisId, packId: resolvedPackId },
      {},
    );
  }

  const emotion = opts.emotion || 'neutral';
  const intensity = opts.intensity ?? 1;
  const timeSec = opts.timeSec ?? 0;

  const bodyEval = evaluateBody(emotion, intensity, opts.bodyOpts || {});
  const pose = sampleBodyPose(bodyEval.body, timeSec);

  let walk = null;
  if (opts.walking && pack.joints.hip_L) {
    const gaitEval = evaluateGait(emotion, intensity);
    const gait = gaitEval.gait;
    const phase = opts.gaitPhase ?? (timeSec * (gait.cadence || 1) * 0.5) % 1;
    const sample = sampleWalkPose(gait, phase);
    const stride = gait.strideLength ?? 1;
    const swing = Math.sin(phase * Math.PI * 2) * 0.45 * stride;
    walk = {
      hipL: swing,
      hipR: -swing,
      kneeL: Math.max(0, -swing) * 0.9 + 0.08,
      kneeR: Math.max(0, swing) * 0.9 + 0.08,
      ankleL: -swing * 0.25,
      ankleR: swing * 0.25,
      pelvisYaw: sample.pelvisYaw ?? 0,
    };
  }

  let raw = mapFrameToJoints(pack, {
    emotion,
    intensity,
    viseme: opts.viseme,
    mouth: opts.mouth,
    lookX: opts.lookX,
    lookY: opts.lookY,
    blinkL: opts.blinkL,
    blinkR: opts.blinkR,
    body: bodyEval.body,
    pose,
    walk,
    gesture: opts.gesture,
  });

  if (chassisId) {
    const calibrated = calibrateRawJoints(chassisId, raw, pack);
    if (!calibrated.error) raw = calibrated.joints;
  }

  let joints = clampJoints(pack, raw);

  if (opts.slew && typeof opts.dtSec === 'number') {
    const slewed = opts.slew.step(joints, opts.dtSec);
    /** @type {typeof joints} */
    const next = {};
    for (const [id, j] of Object.entries(joints)) {
      next[id] = { ...j, value: slewed[id] ?? j.value };
    }
    joints = next;
  }

  const chassis = chassisId ? getChassis(chassisId) : null;

  return applyComplianceGate(
    {
      kind: 'robot_driver',
      packId: pack.id,
      chassisId: chassis?.id || null,
      chassisLabel: chassis?.label || null,
      label: pack.label,
      protocol: pack.protocol || ROBOT_PROTOCOL,
      rateHz: pack.rateHz,
      dof: pack.dof,
      surfaceLevel: pack.surfaceLevel,
      emotion,
      intensity,
      joints,
      nonzero: robotJointsNonZero(joints),
      bodyGazeCombo: bodyEval.gazeCombo,
      walking: !!opts.walking,
      timestamp: timeSec,
    },
    {},
  );
}

/**
 * Encode a driver frame as a single JSON line (UDP/WS ready).
 * @param {ReturnType<typeof driveRobot>} frame
 */
export function encodeRobotLine(frame) {
  if (!frame || frame.error) return '';
  /** @type {Record<string, number>} */
  const values = {};
  for (const [id, j] of Object.entries(frame.joints || {})) {
    values[id] = j.value;
  }
  return JSON.stringify({
    protocol: frame.protocol || ROBOT_PROTOCOL,
    pack: frame.packId,
    chassis: frame.chassisId || null,
    t: frame.timestamp,
    joints: values,
  });
}

/**
 * Publisher helper — buffer latest frame; flush as JSON lines.
 */
export class RobotDriverPublisher {
  /**
   * @param {string} [packId]
   * @param {{ chassisId?: string, slew?: boolean }} [opts]
   */
  constructor(packId = DEFAULT_ROBOT_PACK, opts = {}) {
    this.packId = packId;
    this.chassisId = opts.chassisId || null;
    this.slew =
      opts.slew === false
        ? null
        : new ChassisSlewLimiter(opts.chassisId || DEFAULT_CHASSIS);
    /** @type {ReturnType<typeof driveRobot>|null} */
    this.latest = null;
    this.enabled = false;
    this._lastT = null;
  }

  /**
   * @param {Parameters<typeof driveRobot>[1]} opts
   */
  publish(opts = {}) {
    const timeSec = opts.timeSec ?? 0;
    const dtSec =
      this._lastT == null ? 1 / 30 : Math.max(1e-3, timeSec - this._lastT);
    this._lastT = timeSec;
    if (this.slew && opts.chassisId) this.slew.setChassis(opts.chassisId);
    else if (this.slew && this.chassisId) this.slew.setChassis(this.chassisId);
    this.latest = driveRobot(this.packId, {
      ...opts,
      chassisId: opts.chassisId || this.chassisId,
      slew: this.slew,
      dtSec,
    });
    return this.latest;
  }

  /**
   * @returns {string}
   */
  flushLine() {
    if (!this.enabled || !this.latest) return '';
    return encodeRobotLine(this.latest);
  }
}
