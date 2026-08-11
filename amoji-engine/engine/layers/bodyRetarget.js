/**
 * Full-body retarget — map Layer B / W / G channels → 117-set body point deltas
 * and Sakura bone names for Face Live / robot drivers.
 */
import bodyPoints from '../../data/points/body-40.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const BODY_FRONT = bodyPoints.front;
export const BODY_BACK = bodyPoints.back;
export const BODY_POINTS = [...BODY_FRONT, ...BODY_BACK];
export const BODY_POINT_COUNT = BODY_POINTS.length;
export const FACE_POINT_COUNT = 77;
export const FULL_BODY_POINT_BUDGET = FACE_POINT_COUNT + BODY_POINT_COUNT;
export const BONE_MAP = bodyPoints.boneMap;

/**
 * @param {string} id
 */
export function getBodyPoint(id) {
  return BODY_POINTS.find((p) => p.id === id) || null;
}

/**
 * @param {string} pointId
 * @returns {string|null}
 */
export function bodyPointToBone(pointId) {
  return BONE_MAP[pointId] || null;
}

/**
 * Empty delta bag for all body points.
 */
export function emptyBodyDeltas() {
  /** @type {Record<string, { x: number, y: number, z: number }>} */
  const out = {};
  for (const p of BODY_POINTS) out[p.id] = { x: 0, y: 0, z: 0 };
  return out;
}

/**
 * @param {Record<string, { x: number, y: number, z: number }>} deltas
 * @param {string} id
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
function addDelta(deltas, id, x, y, z) {
  if (!deltas[id]) deltas[id] = { x: 0, y: 0, z: 0 };
  deltas[id].x += x;
  deltas[id].y += y;
  deltas[id].z += z;
}

/**
 * Retarget Layer B body pose sample → point deltas.
 * @param {object} bodyEval evaluateBody().body + sampleBodyPose()
 * @param {object} [pose] sampleBodyPose result
 */
export function retargetLayerB(bodyEval, pose = {}) {
  const deltas = emptyBodyDeltas();
  const b = bodyEval || {};
  const ama = b.accessoryMuscleActivation ?? 0;
  const sh = b.shoulderHeight ?? ama;
  const chest = (pose.chestScale ?? 1) - 1;
  const lift = pose.clavicleLift ?? sh * 0.1;
  const round = pose.clavicleRound ?? (b.shoulderRoundness ?? 0) * 0.05;
  const pitch = pose.headPitch ?? (b.headTiltVertical ?? 0) * 0.2;
  const roll = pose.headRoll ?? (b.headTiltLateral ?? 0) * 0.2;

  addDelta(deltas, 'NK-FRONT', 0, -pitch * 0.4, 0);
  addDelta(deltas, 'NK-BACK', 0, pitch * 0.35, 0);
  addDelta(deltas, 'CL-L', 0, lift, -round);
  addDelta(deltas, 'CL-R', 0, lift, round);
  addDelta(deltas, 'SH-L', 0, lift * 1.2 + ama * 0.05, -round);
  addDelta(deltas, 'SH-R', 0, lift * 1.2 + ama * 0.05, round);
  addDelta(deltas, 'SC-L', 0, ama * 0.04, -ama * 0.03);
  addDelta(deltas, 'SC-R', 0, ama * 0.04, ama * 0.03);
  addDelta(deltas, 'CS-TOP', 0, chest * 0.5, chest * 0.3);
  addDelta(deltas, 'CS-CTR', 0, chest, chest * 0.5);
  addDelta(deltas, 'CS-LOW', 0, chest * 0.7, chest * 0.4);
  addDelta(deltas, 'SP-T', 0, pose.spineBend ?? 0, -(b.chestExpansion ?? 0) * 0.03);
  addDelta(deltas, 'SP-L', 0, (pose.spineBend ?? 0) * 0.6, -(b.shoulderRoundness ?? 0) * 0.04);
  addDelta(deltas, 'SP-S', roll * 0.05, 0, 0);

  return deltas;
}

/**
 * Retarget gait walk sample → lower-body point deltas.
 * @param {object} gait evaluateGait().gait
 * @param {object} walk sampleWalkPose()
 * @param {number} [phase=0]
 */
export function retargetLayerW(gait, walk = {}, phase = 0) {
  const deltas = emptyBodyDeltas();
  const g = gait || {};
  const stride = g.strideLength ?? 1;
  const bounce = walk.vertical ?? 0;
  const yaw = walk.pelvisYaw ?? 0;
  const swing = Math.sin(phase * Math.PI * 2);

  addDelta(deltas, 'PV-CTR', yaw * 0.02, bounce, 0);
  addDelta(deltas, 'PV-L', -yaw * 0.03, bounce * 0.5, swing * 0.02 * stride);
  addDelta(deltas, 'PV-R', yaw * 0.03, bounce * 0.5, -swing * 0.02 * stride);
  addDelta(deltas, 'SP-S', yaw * 0.04, bounce * 0.3, 0);
  addDelta(deltas, 'GL-L', 0, bounce * 0.2, swing * 0.015);
  addDelta(deltas, 'GL-R', 0, bounce * 0.2, -swing * 0.015);

  const leg = stride * 0.08;
  addDelta(deltas, 'TH-L', 0, 0, swing * leg);
  addDelta(deltas, 'TH-R', 0, 0, -swing * leg);
  addDelta(deltas, 'KN-L', 0, -Math.abs(swing) * leg * 0.6, swing * leg * 0.5);
  addDelta(deltas, 'KN-R', 0, -Math.abs(-swing) * leg * 0.6, -swing * leg * 0.5);
  addDelta(deltas, 'KN-L-BACK', 0, Math.abs(swing) * leg * 0.4, 0);
  addDelta(deltas, 'KN-R-BACK', 0, Math.abs(-swing) * leg * 0.4, 0);
  addDelta(deltas, 'SK-L', 0, 0, swing * leg * 0.7);
  addDelta(deltas, 'SK-R', 0, 0, -swing * leg * 0.7);
  addDelta(deltas, 'AN-L', 0, -Math.max(0, -swing) * 0.03, swing * leg * 0.4);
  addDelta(deltas, 'AN-R', 0, -Math.max(0, swing) * 0.03, -swing * leg * 0.4);
  addDelta(deltas, 'TO-L', 0, -Math.max(0, -swing) * 0.02, swing * leg * 0.35);
  addDelta(deltas, 'TO-R', 0, -Math.max(0, swing) * 0.02, -swing * leg * 0.35);

  const heavy = g.footstepWeight === 'heavy' ? 0.025 : g.footstepWeight === 'drag' ? 0.01 : 0.015;
  addDelta(deltas, 'HL-L', 0, -Math.max(0, -swing) * heavy, 0);
  addDelta(deltas, 'HL-R', 0, -Math.max(0, swing) * heavy, 0);

  // Fear distal arm swing origin → emphasize elbow points
  const arm = (walk.armL ?? 0) * 0.05;
  const armR = (walk.armR ?? 0) * 0.05;
  if (g.armSwingOrigin === 'elbow') {
    addDelta(deltas, 'EL-L', 0, 0, arm);
    addDelta(deltas, 'EL-R', 0, 0, armR);
    addDelta(deltas, 'FA-L', 0, 0, arm * 1.2);
    addDelta(deltas, 'FA-R', 0, 0, armR * 1.2);
  } else {
    addDelta(deltas, 'UA-L', 0, 0, arm);
    addDelta(deltas, 'UA-R', 0, 0, armR);
    addDelta(deltas, 'FA-L', 0, 0, arm * 0.8);
    addDelta(deltas, 'FA-R', 0, 0, armR * 0.8);
  }

  return deltas;
}

/**
 * Retarget gesture bone sample → arm/hand point deltas.
 * @param {object} gesture sampleGesturePose / GestureController tick
 */
export function retargetLayerG(gesture) {
  const deltas = emptyBodyDeltas();
  const bones = gesture?.bones || {};
  const map = [
    ['upperarm_L', 'UA-L', 0.08],
    ['upperarm_R', 'UA-R', 0.08],
    ['lowerarm_L', 'EL-L', 0.07],
    ['lowerarm_R', 'EL-R', 0.07],
    ['hand_L', 'WR-L', 0.05],
    ['hand_R', 'WR-R', 0.05],
  ];
  for (const [bone, point, s] of map) {
    const r = bones[bone] || [0, 0, 0];
    addDelta(deltas, point, r[2] * s, r[0] * s, r[1] * s);
  }
  addDelta(deltas, 'HN-L', 0, -(gesture?.fist ?? 0) * 0.02, (gesture?.handOpen ?? 0) * 0.02);
  addDelta(deltas, 'HN-R', 0, -(gesture?.fist ?? 0) * 0.02, (gesture?.handOpen ?? 0) * 0.02);
  addDelta(deltas, 'FG-L-PT', 0, 0, (gesture?.handOpen ?? 0) * 0.04);
  addDelta(deltas, 'FG-R-PT', 0, 0, (gesture?.handOpen ?? 0) * 0.04);
  addDelta(deltas, 'UA-L-BACK', 0, 0, (bones.upperarm_L?.[1] ?? 0) * 0.03);
  addDelta(deltas, 'UA-R-BACK', 0, 0, (bones.upperarm_R?.[1] ?? 0) * 0.03);
  return deltas;
}

/**
 * Merge body delta maps (sum).
 * @param {...Record<string, { x: number, y: number, z: number }>} maps
 */
export function mergeBodyDeltas(...maps) {
  const out = emptyBodyDeltas();
  for (const m of maps) {
    if (!m) continue;
    for (const [id, d] of Object.entries(m)) {
      addDelta(out, id, d.x || 0, d.y || 0, d.z || 0);
    }
  }
  return out;
}

/**
 * Compose B+W+G into a full body retarget frame.
 * @param {{
 *   body?: object,
 *   bodyPose?: object,
 *   gait?: object,
 *   walk?: object,
 *   walkPhase?: number,
 *   gesture?: object,
 * }} layers
 */
export function retargetBody(layers = {}) {
  const b = retargetLayerB(layers.body, layers.bodyPose);
  const w = retargetLayerW(layers.gait, layers.walk, layers.walkPhase ?? 0);
  const g = retargetLayerG(layers.gesture);
  const deltas = mergeBodyDeltas(b, w, g);
  const nonzero = Object.entries(deltas)
    .filter(([, d]) => Math.hypot(d.x, d.y, d.z) > 1e-4)
    .sort((a, b) => Math.hypot(b[1].x, b[1].y, b[1].z) - Math.hypot(a[1].x, a[1].y, a[1].z));

  return applyComplianceGate(
    {
      kind: 'body_retarget',
      pointCount: BODY_POINT_COUNT,
      facePlusBodyBudget: FULL_BODY_POINT_BUDGET,
      deltas,
      top: nonzero.slice(0, 8).map(([id, d]) => ({
        id,
        mag: Math.hypot(d.x, d.y, d.z),
        bone: bodyPointToBone(id),
      })),
    },
    {},
  );
}
