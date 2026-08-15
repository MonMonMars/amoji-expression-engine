/**
 * Multi-library body retarget maps for Amoji Sakura / MB-Lab armatures
 * and free full-body references (Quaternius mannequin, MPFB, Mixamo).
 * Used with three.js SkeletonUtils.retarget / retargetClip.
 *
 * `names` always map **target bone → source bone**.
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

import { SAKURA_TO_MIXAMO, MIXAMO_BODY_BONE_RE, findSkinnedMesh } from './mixamoRetarget.js';

/** Full-body bones on Sakura driven by any body-motion library. */
export const BODY_MOTION_BONE_RE = MIXAMO_BODY_BONE_RE;

/** Canonical joint keys shared across profiles. */
export const BODY_JOINT_KEYS = [
  'pelvis',
  'spine01',
  'spine02',
  'spine03',
  'neck',
  'head',
  'clavicle_L',
  'clavicle_R',
  'upperarm_L',
  'upperarm_R',
  'lowerarm_L',
  'lowerarm_R',
  'hand_L',
  'hand_R',
  'thigh_L',
  'thigh_R',
  'calf_L',
  'calf_R',
  'foot_L',
  'foot_R',
  'toes_L',
  'toes_R',
];

/** Canonical → Sakura / MB-Lab */
export const JOINTS_SAKURA = {
  pelvis: 'pelvis',
  spine01: 'spine01',
  spine02: 'spine02',
  spine03: 'spine03',
  neck: 'neck',
  head: 'head',
  clavicle_L: 'clavicle_L',
  clavicle_R: 'clavicle_R',
  upperarm_L: 'upperarm_L',
  upperarm_R: 'upperarm_R',
  lowerarm_L: 'lowerarm_L',
  lowerarm_R: 'lowerarm_R',
  hand_L: 'hand_L',
  hand_R: 'hand_R',
  thigh_L: 'thigh_L',
  thigh_R: 'thigh_R',
  calf_L: 'calf_L',
  calf_R: 'calf_R',
  foot_L: 'foot_L',
  foot_R: 'foot_R',
  toes_L: 'toes_L',
  toes_R: 'toes_R',
};

/** Quaternius Female Mannequin (UE-style lowercase). */
export const JOINTS_MANNEQUIN = {
  pelvis: 'pelvis',
  spine01: 'spine_01',
  spine02: 'spine_02',
  spine03: 'spine_03',
  neck: 'neck_01',
  head: 'Head',
  clavicle_L: 'clavicle_l',
  clavicle_R: 'clavicle_r',
  upperarm_L: 'upperarm_l',
  upperarm_R: 'upperarm_r',
  lowerarm_L: 'lowerarm_l',
  lowerarm_R: 'lowerarm_r',
  hand_L: 'hand_l',
  hand_R: 'hand_r',
  thigh_L: 'thigh_l',
  thigh_R: 'thigh_r',
  calf_L: 'calf_l',
  calf_R: 'calf_r',
  foot_L: 'foot_l',
  foot_R: 'foot_r',
  toes_L: 'ball_l',
  toes_R: 'ball_r',
};

/** MPFB / TalkingHead sample (Mixamo names without mixamorig prefix). */
export const JOINTS_MIXAMO_PLAIN = {
  pelvis: 'Hips',
  spine01: 'Spine',
  spine02: 'Spine1',
  spine03: 'Spine2',
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
};

/** Mixamo with mixamorig prefix (source clips). */
export const JOINTS_MIXAMO = { ...SAKURA_TO_MIXAMO };

/** CMU / cgspeed BVH. */
export const JOINTS_CMU = {
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

/** Quaternius UAL1 Godot Standard (DEF-* without Rigify dots). */
export const JOINTS_QUATERNIUS = {
  pelvis: 'DEF-hips',
  spine01: 'DEF-spine001',
  spine02: 'DEF-spine002',
  spine03: 'DEF-spine003',
  neck: 'DEF-neck',
  head: 'DEF-head',
  clavicle_L: 'DEF-shoulderL',
  clavicle_R: 'DEF-shoulderR',
  upperarm_L: 'DEF-upper_armL',
  upperarm_R: 'DEF-upper_armR',
  lowerarm_L: 'DEF-forearmL',
  lowerarm_R: 'DEF-forearmR',
  hand_L: 'DEF-handL',
  hand_R: 'DEF-handR',
  thigh_L: 'DEF-thighL',
  thigh_R: 'DEF-thighR',
  calf_L: 'DEF-shinL',
  calf_R: 'DEF-shinR',
  foot_L: 'DEF-footL',
  foot_R: 'DEF-footR',
  toes_L: 'DEF-toeL',
  toes_R: 'DEF-toeR',
};

/** three.js examples pirouette.bvh (experimental). */
export const JOINTS_PIROUETTE = {
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

/** @deprecated prefer buildRetargetNames — Sakura→source maps */
export const SAKURA_TO_CMU = Object.fromEntries(
  BODY_JOINT_KEYS.filter((k) => JOINTS_CMU[k]).map((k) => [JOINTS_SAKURA[k], JOINTS_CMU[k]]),
);
export const SAKURA_TO_QUATERNIUS = Object.fromEntries(
  BODY_JOINT_KEYS.filter((k) => JOINTS_QUATERNIUS[k]).map((k) => [
    JOINTS_SAKURA[k],
    JOINTS_QUATERNIUS[k],
  ]),
);
export const SAKURA_TO_PIROUETTE = Object.fromEntries(
  BODY_JOINT_KEYS.filter((k) => JOINTS_PIROUETTE[k]).map((k) => [
    JOINTS_SAKURA[k],
    JOINTS_PIROUETTE[k],
  ]),
);

const JOINT_TABLES = {
  sakura: JOINTS_SAKURA,
  mannequin: JOINTS_MANNEQUIN,
  mixamoPlain: JOINTS_MIXAMO_PLAIN,
  mixamo: JOINTS_MIXAMO,
  cmu: JOINTS_CMU,
  quaternius: JOINTS_QUATERNIUS,
  pirouette: JOINTS_PIROUETTE,
};

const PROFILES = {
  mixamo: { joints: JOINTS_MIXAMO, hip: 'mixamorigHips' },
  mixamoPlain: { joints: JOINTS_MIXAMO_PLAIN, hip: 'Hips' },
  cmu: { joints: JOINTS_CMU, hip: 'Hips' },
  quaternius: { joints: JOINTS_QUATERNIUS, hip: 'DEF-hips' },
  pirouette: { joints: JOINTS_PIROUETTE, hip: 'hip' },
  sakura: { joints: JOINTS_SAKURA, hip: 'pelvis' },
  mannequin: { joints: JOINTS_MANNEQUIN, hip: 'pelvis' },
};

/** @param {keyof typeof PROFILES | string} profile */
export function bodyProfileHip(profile) {
  return (PROFILES[profile] || PROFILES.sakura).hip;
}

/**
 * Build target→source name map between two skeleton profiles.
 * @param {keyof typeof JOINT_TABLES | string} targetProfile
 * @param {keyof typeof JOINT_TABLES | string} sourceProfile
 */
export function buildRetargetNames(targetProfile, sourceProfile) {
  const target = JOINT_TABLES[targetProfile] || JOINT_TABLES.sakura;
  const source = JOINT_TABLES[sourceProfile] || JOINT_TABLES.mixamo;
  /** @type {Record<string, string>} */
  const names = {};
  for (const key of BODY_JOINT_KEYS) {
    const t = target[key];
    const s = source[key];
    if (t && s) names[t] = s;
  }
  return names;
}

/**
 * Detect which joint table matches a skinned mesh / Object3D.
 * @param {any} root
 * @returns {keyof typeof JOINT_TABLES}
 */
export function detectBodySkeletonProfile(root) {
  const names = new Set();
  const skinned = findSkinnedMesh(root);
  if (skinned?.skeleton?.bones) {
    for (const b of skinned.skeleton.bones) {
      if (b?.name) names.add(b.name);
    }
  }
  root?.traverse?.((c) => {
    if (c?.isBone && c.name) names.add(c.name);
  });

  if (names.has('DEF-hips')) return 'quaternius';
  if (names.has('mixamorigHips')) return 'mixamo';
  if (names.has('upperarm_l') && names.has('pelvis')) return 'mannequin';
  if (names.has('upperarm_L') && names.has('pelvis')) return 'sakura';
  if (names.has('Hips') && names.has('LeftArm') && !names.has('LowerBack')) {
    return 'mixamoPlain';
  }
  if (names.has('Hips') && names.has('LeftUpLeg')) return 'cmu';
  if (names.has('hip') && names.has('lThigh')) return 'pirouette';
  return 'sakura';
}

/**
 * @param {keyof typeof PROFILES | string} profile source clip profile (legacy API)
 * @param {{ scale?: number, hipInfluence?: { x: number, y: number, z: number }, targetProfile?: string }} [opts]
 */
export function bodyMotionRetargetOptions(profile, opts = {}) {
  const sourceProfile = PROFILES[profile] ? profile : 'mixamo';
  const targetProfile = opts.targetProfile || 'sakura';
  const source = PROFILES[sourceProfile] || PROFILES.mixamo;
  return {
    names: buildRetargetNames(targetProfile, sourceProfile),
    hip: source.hip,
    scale: opts.scale ?? 1,
    hipInfluence: opts.hipInfluence ?? { x: 1, y: 1, z: 1 },
    preserveBonePositions: true,
    useFirstFramePosition: true,
    fps: 30,
  };
}

/**
 * @param {keyof typeof PROFILES | string} profile
 * @returns {Record<string, string>} legacy Sakura→source map
 */
export function boneMapForProfile(profile) {
  return buildRetargetNames('sakura', profile);
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
 * Hip scale between target hip and a source skeleton hip bone.
 * @param {any} targetSkinned
 * @param {any} sourceSkeleton THREE.Skeleton or SkinnedMesh
 * @param {string} sourceHipName
 * @param {string} [targetHipName='pelvis']
 */
export function estimateBodyMotionHipScale(
  targetSkinned,
  sourceSkeleton,
  sourceHipName,
  targetHipName = 'pelvis',
) {
  const bones = sourceSkeleton?.isSkinnedMesh
    ? sourceSkeleton.skeleton?.bones
    : sourceSkeleton?.bones;
  const sHip = targetSkinned?.skeleton?.bones?.find((b) => b.name === targetHipName);
  const mHip = bones?.find((b) => b.name === sourceHipName);
  if (!sHip || !mHip) return 0.01;
  targetSkinned.updateMatrixWorld?.(true);
  mHip.updateWorldMatrix?.(true, false);
  const sy = Math.abs(sHip.matrixWorld?.elements?.[13] ?? 1);
  const my = Math.abs(mHip.matrixWorld?.elements?.[13] ?? 100);
  if (!Number.isFinite(sy) || !Number.isFinite(my) || my < 1e-4) return 0.01;
  const ratio = sy / my;
  if (ratio < 0.001) return 0.01;
  if (ratio > 2) return 1;
  return ratio;
}
