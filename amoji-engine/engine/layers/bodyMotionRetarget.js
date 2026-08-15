/**
 * Multi-library body retarget maps for Amoji Sakura / MB-Lab armatures.
 * Used with three.js SkeletonUtils.retarget / retargetClip.
 *
 * `names` always map **target (Sakura) bone → source bone**.
 */
export {
  SAKURA_TO_MIXAMO,
  MIXAMO_BODY_BONE_RE,
  MIXAMO_DEMO_CLIPS,
  mixamoBoneForSakura,
  mixamoRetargetOptions,
  findSkinnedMesh,
  pickMixamoClip,
  estimateMixamoHipScale,
} from './mixamoRetarget.js';

import { SAKURA_TO_MIXAMO, MIXAMO_BODY_BONE_RE } from './mixamoRetarget.js';

/** Full-body bones on Sakura driven by any body-motion library. */
export const BODY_MOTION_BONE_RE = MIXAMO_BODY_BONE_RE;

/** CMU / cgspeed BVH (Hips, LeftUpLeg, …). */
export const SAKURA_TO_CMU = {
  pelvis: 'Hips',
  spine01: 'LowerBack',
  spine02: 'Spine',
  spine03: 'Spine1',
  neck: 'Neck',
  head: 'Head',
  clavicle_L: 'LeftShoulder',
  clavicle_R: 'RightShoulder',
  upperarm_L: 'LeftArm',
  upperarm_R: 'RightArm',
  lowerarm_L: 'LeftForeArm',
  lowerarm_R: 'RightForeArm',
  hand_L: 'LeftHand',
  hand_R: 'RightHand',
  thigh_L: 'LeftUpLeg',
  thigh_R: 'RightUpLeg',
  calf_L: 'LeftLeg',
  calf_R: 'RightLeg',
  foot_L: 'LeftFoot',
  foot_R: 'RightFoot',
  toes_L: 'LeftToeBase',
  toes_R: 'RightToeBase',
};

/** Quaternius UAL / Rigify DEF-* (Godot Standard glTF). */
export const SAKURA_TO_QUATERNIUS = {
  pelvis: 'DEF-hips',
  spine01: 'DEF-spine.001',
  spine02: 'DEF-spine.002',
  spine03: 'DEF-spine.003',
  neck: 'DEF-neck',
  head: 'DEF-head',
  clavicle_L: 'DEF-shoulder.L',
  clavicle_R: 'DEF-shoulder.R',
  upperarm_L: 'DEF-upper_arm.L',
  upperarm_R: 'DEF-upper_arm.R',
  lowerarm_L: 'DEF-forearm.L',
  lowerarm_R: 'DEF-forearm.R',
  hand_L: 'DEF-hand.L',
  hand_R: 'DEF-hand.R',
  thigh_L: 'DEF-thigh.L',
  thigh_R: 'DEF-thigh.R',
  calf_L: 'DEF-shin.L',
  calf_R: 'DEF-shin.R',
  foot_L: 'DEF-foot.L',
  foot_R: 'DEF-foot.R',
  toes_L: 'DEF-toe.L',
  toes_R: 'DEF-toe.R',
};

/** three.js examples pirouette.bvh (experimental). */
export const SAKURA_TO_PIROUETTE = {
  pelvis: 'hip',
  spine01: 'abdomen',
  spine02: 'chest',
  neck: 'neck',
  head: 'head',
  clavicle_L: 'lCollar',
  clavicle_R: 'rCollar',
  upperarm_L: 'lShldr',
  upperarm_R: 'rShldr',
  lowerarm_L: 'lForeArm',
  lowerarm_R: 'rForeArm',
  hand_L: 'lHand',
  hand_R: 'rHand',
  thigh_L: 'lThigh',
  thigh_R: 'rThigh',
  calf_L: 'lShin',
  calf_R: 'rShin',
  foot_L: 'lFoot',
  foot_R: 'rFoot',
};

const PROFILES = {
  mixamo: { names: SAKURA_TO_MIXAMO, hip: 'mixamorigHips' },
  cmu: { names: SAKURA_TO_CMU, hip: 'Hips' },
  quaternius: { names: SAKURA_TO_QUATERNIUS, hip: 'DEF-hips' },
  pirouette: { names: SAKURA_TO_PIROUETTE, hip: 'hip' },
};

/**
 * @param {keyof typeof PROFILES | string} profile
 * @param {{ scale?: number, hipInfluence?: { x: number, y: number, z: number } }} [opts]
 */
export function bodyMotionRetargetOptions(profile, opts = {}) {
  const p = PROFILES[profile] || PROFILES.mixamo;
  return {
    names: { ...p.names },
    hip: p.hip,
    scale: opts.scale ?? 1,
    hipInfluence: opts.hipInfluence ?? { x: 1, y: 1, z: 1 },
    preserveBonePositions: true,
    useFirstFramePosition: true,
    fps: 30,
  };
}

/**
 * @param {keyof typeof PROFILES | string} profile
 * @returns {Record<string, string>}
 */
export function boneMapForProfile(profile) {
  return { ...(PROFILES[profile] || PROFILES.mixamo).names };
}

/**
 * Pick clip from a multi-clip container (Quaternius UAL / Mixamo packs).
 * @param {Array<{ name: string, duration: number, tracks: unknown[] }>} clips
 * @param {string} [preferredName]
 */
export function pickBodyMotionClip(clips, preferredName) {
  if (!Array.isArray(clips) || !clips.length) return null;
  if (preferredName) {
    const hit = clips.find(
      (c) => c && c.name === preferredName && c.duration > 0.05 && (c.tracks?.length ?? 0) > 0,
    );
    if (hit) return hit;
  }
  const usable = clips.filter((c) => c && c.duration > 0.05 && (c.tracks?.length ?? 0) > 0);
  if (!usable.length) return null;
  return usable.reduce((a, b) => (b.duration > a.duration ? b : a));
}

/**
 * Hip scale between Sakura pelvis and a source skeleton hip bone.
 * @param {any} sakuraSkinned
 * @param {any} sourceSkeleton THREE.Skeleton or SkinnedMesh
 * @param {string} sourceHipName
 */
export function estimateBodyMotionHipScale(sakuraSkinned, sourceSkeleton, sourceHipName) {
  const bones = sourceSkeleton?.isSkinnedMesh
    ? sourceSkeleton.skeleton?.bones
    : sourceSkeleton?.bones;
  const sHip = sakuraSkinned?.skeleton?.bones?.find((b) => b.name === 'pelvis');
  const mHip = bones?.find((b) => b.name === sourceHipName);
  if (!sHip || !mHip) return 0.01;
  sakuraSkinned.updateMatrixWorld?.(true);
  mHip.updateWorldMatrix?.(true, false);
  const sy = Math.abs(sHip.matrixWorld?.elements?.[13] ?? 1);
  const my = Math.abs(mHip.matrixWorld?.elements?.[13] ?? 100);
  if (!Number.isFinite(sy) || !Number.isFinite(my) || my < 1e-4) return 0.01;
  const ratio = sy / my;
  if (ratio < 0.001) return 0.01;
  if (ratio > 2) return 1;
  return ratio;
}
