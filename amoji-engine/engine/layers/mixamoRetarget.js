/**
 * Mixamo (Adobe) body-animation interop for Amoji Sakura / MB-Lab armatures.
 *
 * Adobe Mixamo animations are royalty-free for commercial use when baked into a
 * product (not redistributed as standalone asset packs). See:
 * https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html
 *
 * `names` maps **target (Sakura) bone → Mixamo source bone** for SkeletonUtils.retarget*.
 */

/** @type {Record<string, string>} Sakura / MB-Lab → mixamorig* */
export const SAKURA_TO_MIXAMO = {
  pelvis: 'mixamorigHips',
  spine01: 'mixamorigSpine',
  spine02: 'mixamorigSpine1',
  spine03: 'mixamorigSpine2',
  neck: 'mixamorigNeck',
  head: 'mixamorigHead',
  clavicle_L: 'mixamorigLeftShoulder',
  clavicle_R: 'mixamorigRightShoulder',
  upperarm_L: 'mixamorigLeftArm',
  upperarm_R: 'mixamorigRightArm',
  lowerarm_L: 'mixamorigLeftForeArm',
  lowerarm_R: 'mixamorigRightForeArm',
  hand_L: 'mixamorigLeftHand',
  hand_R: 'mixamorigRightHand',
  thigh_L: 'mixamorigLeftUpLeg',
  thigh_R: 'mixamorigRightUpLeg',
  calf_L: 'mixamorigLeftLeg',
  calf_R: 'mixamorigRightLeg',
  foot_L: 'mixamorigLeftFoot',
  foot_R: 'mixamorigRightFoot',
  toes_L: 'mixamorigLeftToeBase',
  toes_R: 'mixamorigRightToeBase',
};

/** Bones Mixamo body mode should capture on Sakura (full body, not face-only). */
export const MIXAMO_BODY_BONE_RE =
  /^(pelvis|spine0[123]|neck|head|clavicle_[LR]|upperarm_[LR]|lowerarm_[LR]|hand_[LR]|thigh_[LR]|calf_[LR]|foot_[LR]|toes_[LR])$/;

/** Catalog of demo clips shipped under assets/characters/jp-female-v0/mixamo/ */
export const MIXAMO_DEMO_CLIPS = [
  {
    id: 'samba',
    label: 'Samba Dancing',
    file: 'SambaDancing.fbx',
    help: 'Mixamo samba — full-body demo (three.js examples redistrib)',
  },
  {
    id: 'mixamoIdle',
    label: 'Mixamo pack',
    file: 'mixamo.fbx',
    help: 'Mixamo.com pack clip — full-body demo (three.js examples redistrib)',
  },
];

/**
 * @param {string} sakuraBone
 * @returns {string | undefined}
 */
export function mixamoBoneForSakura(sakuraBone) {
  return SAKURA_TO_MIXAMO[sakuraBone];
}

/**
 * Options for three.js SkeletonUtils.retarget / retargetClip.
 * @param {{ scale?: number, hipInfluence?: { x: number, y: number, z: number } }} [opts]
 */
export function mixamoRetargetOptions(opts = {}) {
  return {
    names: { ...SAKURA_TO_MIXAMO },
    hip: 'mixamorigHips',
    scale: opts.scale ?? 1,
    hipInfluence: opts.hipInfluence ?? { x: 1, y: 1, z: 1 },
    preserveBonePositions: true,
    useFirstFramePosition: true,
    fps: 30,
  };
}

/**
 * Find first SkinnedMesh under a root (Mixamo FBX or Sakura GLB).
 * @param {{ traverse: (fn: (o: any) => void) => void }} root
 * @returns {any | null}
 */
export function findSkinnedMesh(root) {
  let found = null;
  root.traverse((o) => {
    if (!found && o.isSkinnedMesh && o.skeleton) found = o;
  });
  return found;
}

/**
 * Pick the longest non-empty AnimationClip (Mixamo often ships empty "Take 001").
 * @param {Array<{ name: string, duration: number, tracks: unknown[] }>} clips
 */
export function pickMixamoClip(clips) {
  if (!Array.isArray(clips) || !clips.length) return null;
  const usable = clips.filter((c) => c && c.duration > 0.05 && (c.tracks?.length ?? 0) > 0);
  if (!usable.length) return null;
  return usable.reduce((a, b) => (b.duration > a.duration ? b : a));
}

/**
 * Approximate uniform scale so Mixamo hip height matches Sakura pelvis height.
 * @param {any} sakuraSkinned
 * @param {any} mixamoSkinned
 */
export function estimateMixamoHipScale(sakuraSkinned, mixamoSkinned) {
  const sHip = sakuraSkinned?.skeleton?.bones?.find((b) => b.name === 'pelvis');
  const mHip = mixamoSkinned?.skeleton?.bones?.find(
    (b) => b.name === 'mixamorigHips' || b.name === 'mixamorig:Hips',
  );
  if (!sHip || !mHip) return 0.01; // Mixamo is often authored in cm
  sakuraSkinned.updateMatrixWorld?.(true);
  mixamoSkinned.updateMatrixWorld?.(true);
  const sy = Math.abs(sHip.matrixWorld?.elements?.[13] ?? 1);
  const my = Math.abs(mHip.matrixWorld?.elements?.[13] ?? 100);
  if (!Number.isFinite(sy) || !Number.isFinite(my) || my < 1e-4) return 0.01;
  const ratio = sy / my;
  if (ratio < 0.001) return 0.01;
  if (ratio > 2) return 1;
  return ratio;
}
