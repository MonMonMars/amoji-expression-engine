/**
 * Free / open body-motion libraries usable with Sakura Face Live.
 * Prefer commercial-OK sources. Bandai Namco Motiondataset is CC BY-NC — listed but not shipped.
 */

/** @typedef {'mixamo'|'cmu'|'quaternius'|'three-bvh'} BodyMotionSource */
/** @typedef {'fbx'|'bvh'|'gltf'} BodyMotionFormat */
/** @typedef {'mixamo'|'cmu'|'quaternius'|'pirouette'} BoneProfile */

/**
 * @typedef {object} BodyMotionClip
 * @property {string} id
 * @property {string} label
 * @property {BodyMotionSource} source
 * @property {BodyMotionFormat} format
 * @property {BoneProfile} boneProfile
 * @property {string} file relative to assets/characters/jp-female-v0/
 * @property {string} license
 * @property {string} help
 * @property {string} [animationName] preferred clip name inside multi-clip containers
 * @property {boolean} [commercial] default true when omitted
 */

/** @type {BodyMotionClip[]} */
export const BODY_MOTION_CLIPS = [
  // —— Adobe Mixamo (royalty-free commercial when baked into product) ——
  {
    id: 'mixamo-samba',
    label: 'Mixamo · Samba',
    source: 'mixamo',
    format: 'fbx',
    boneProfile: 'mixamo',
    file: 'mixamo/SambaDancing.fbx',
    license: 'Adobe Mixamo — royalty-free commercial (no raw redistribution / no ML training)',
    help: 'Mixamo samba demo (via three.js examples redistrib)',
  },
  {
    id: 'mixamo-pack',
    label: 'Mixamo · Pack',
    source: 'mixamo',
    format: 'fbx',
    boneProfile: 'mixamo',
    file: 'mixamo/mixamo.fbx',
    license: 'Adobe Mixamo — royalty-free commercial (no raw redistribution / no ML training)',
    help: 'Mixamo.com pack clip (via three.js examples redistrib)',
  },

  // —— CMU Graphics Lab MoCap (commercial OK; do not resell raw BVH) ——
  {
    id: 'cmu-07-01-walk',
    label: 'CMU · Walk 07_01',
    source: 'cmu',
    format: 'bvh',
    boneProfile: 'cmu',
    file: 'body-motion/cmu/07_01_walk.bvh',
    license: 'CMU MoCap — free research & commercial; do not resell the data directly',
    help: 'CMU subject 07 walk (cgspeed BVH conversion)',
  },
  {
    id: 'cmu-07-04-walk',
    label: 'CMU · Walk 07_04',
    source: 'cmu',
    format: 'bvh',
    boneProfile: 'cmu',
    file: 'body-motion/cmu/07_04_walk.bvh',
    license: 'CMU MoCap — free research & commercial; do not resell the data directly',
    help: 'CMU subject 07 walk variant',
  },
  {
    id: 'cmu-07-05-slow-walk',
    label: 'CMU · Slow walk 07_05',
    source: 'cmu',
    format: 'bvh',
    boneProfile: 'cmu',
    file: 'body-motion/cmu/07_05_slow_walk.bvh',
    license: 'CMU MoCap — free research & commercial; do not resell the data directly',
    help: 'CMU subject 07 slow walk',
  },
  {
    id: 'cmu-08-04-slow-walk',
    label: 'CMU · Slow walk 08_04',
    source: 'cmu',
    format: 'bvh',
    boneProfile: 'cmu',
    file: 'body-motion/cmu/08_04_slow_walk.bvh',
    license: 'CMU MoCap — free research & commercial; do not resell the data directly',
    help: 'CMU subject 08 slow walk',
  },
  {
    id: 'cmu-40-10-wait',
    label: 'CMU · Wait / idle 40_10',
    source: 'cmu',
    format: 'bvh',
    boneProfile: 'cmu',
    file: 'body-motion/cmu/40_10_wait.bvh',
    license: 'CMU MoCap — free research & commercial; do not resell the data directly',
    help: 'CMU subject 40 wait-for-bus (idle-like fidget)',
  },
  {
    id: 'cmu-16-08-jump',
    label: 'CMU · Jump 16_08',
    source: 'cmu',
    format: 'bvh',
    boneProfile: 'cmu',
    file: 'body-motion/cmu/16_08_jump.bvh',
    license: 'CMU MoCap — free research & commercial; do not resell the data directly',
    help: 'CMU subject 16 jump-ish motion',
  },

  // —— Quaternius Universal Animation Library (CC0) ——
  {
    id: 'q-tpose',
    label: 'Quaternius · T-Pose',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'A_TPose',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 A_TPose from Quaternius UAL',
  },
  {
    id: 'q-idle',
    label: 'Quaternius · Idle',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Idle_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Idle_Loop from Quaternius UAL',
  },
  {
    id: 'q-talk',
    label: 'Quaternius · Talk idle',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Idle_Talking_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Idle_Talking_Loop from Quaternius UAL',
  },
  {
    id: 'q-walk',
    label: 'Quaternius · Walk',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Walk_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Walk_Loop from Quaternius UAL',
  },
  {
    id: 'q-walk-formal',
    label: 'Quaternius · Walk formal',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Walk_Formal_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Walk_Formal_Loop from Quaternius UAL',
  },
  {
    id: 'q-jog',
    label: 'Quaternius · Jog',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Jog_Fwd_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Jog_Fwd_Loop from Quaternius UAL',
  },
  {
    id: 'q-sprint',
    label: 'Quaternius · Sprint',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Sprint_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Sprint_Loop from Quaternius UAL',
  },
  {
    id: 'q-crouch-idle',
    label: 'Quaternius · Crouch idle',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Crouch_Idle_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Crouch_Idle_Loop from Quaternius UAL',
  },
  {
    id: 'q-crouch-fwd',
    label: 'Quaternius · Crouch walk',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Crouch_Fwd_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Crouch_Fwd_Loop from Quaternius UAL',
  },
  {
    id: 'q-dance',
    label: 'Quaternius · Dance',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Dance_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Dance_Loop from Quaternius UAL',
  },
  {
    id: 'q-jump-start',
    label: 'Quaternius · Jump start',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Jump_Start',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Jump_Start from Quaternius UAL',
  },
  {
    id: 'q-jump-loop',
    label: 'Quaternius · Jump loop',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Jump_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Jump_Loop from Quaternius UAL',
  },
  {
    id: 'q-jump-land',
    label: 'Quaternius · Jump land',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Jump_Land',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Jump_Land from Quaternius UAL',
  },
  {
    id: 'q-sit-idle',
    label: 'Quaternius · Sit idle',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Sitting_Idle_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Sitting_Idle_Loop from Quaternius UAL',
  },
  {
    id: 'q-sit-talk',
    label: 'Quaternius · Sit talk',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Sitting_Talking_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Sitting_Talking_Loop from Quaternius UAL',
  },
  {
    id: 'q-interact',
    label: 'Quaternius · Interact',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Interact',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Interact from Quaternius UAL',
  },
  {
    id: 'q-wave-hit',
    label: 'Quaternius · Hit react chest',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Hit_Chest',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Hit_Chest from Quaternius UAL',
  },
  {
    id: 'q-roll',
    label: 'Quaternius · Roll',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Roll',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Roll from Quaternius UAL',
  },
  // —— Quaternius Universal Animation Library 2 (CC0, OGA Standard) ——
  {
    id: 'q2-idle-fold-arms',
    label: 'UAL2 · Idle fold arms',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'mannequin',
    file: 'body-motion/quaternius-ual2/UAL2_Standard.glb',
    animationName: 'Idle_FoldArms_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library 2 — Standard)',
    help: 'CC0 Idle_FoldArms_Loop from Quaternius UAL2',
  },
  {
    id: 'q2-idle-phone',
    label: 'UAL2 · Idle phone talk',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'mannequin',
    file: 'body-motion/quaternius-ual2/UAL2_Standard.glb',
    animationName: 'Idle_TalkingPhone_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library 2 — Standard)',
    help: 'CC0 Idle_TalkingPhone_Loop from Quaternius UAL2',
  },
  {
    id: 'q2-idle-no',
    label: 'UAL2 · Idle no',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'mannequin',
    file: 'body-motion/quaternius-ual2/UAL2_Standard.glb',
    animationName: 'Idle_No_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library 2 — Standard)',
    help: 'CC0 Idle_No_Loop from Quaternius UAL2',
  },
  {
    id: 'q2-walk-carry',
    label: 'UAL2 · Walk carry',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'mannequin',
    file: 'body-motion/quaternius-ual2/UAL2_Standard.glb',
    animationName: 'Walk_Carry_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library 2 — Standard)',
    help: 'CC0 Walk_Carry_Loop from Quaternius UAL2',
  },
  {
    id: 'q2-zombie-idle',
    label: 'UAL2 · Zombie idle',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'mannequin',
    file: 'body-motion/quaternius-ual2/UAL2_Standard.glb',
    animationName: 'Zombie_Idle_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library 2 — Standard)',
    help: 'CC0 Zombie_Idle_Loop from Quaternius UAL2',
  },
  {
    id: 'q2-zombie-walk',
    label: 'UAL2 · Zombie walk',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'mannequin',
    file: 'body-motion/quaternius-ual2/UAL2_Standard.glb',
    animationName: 'Zombie_Walk_Fwd_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library 2 — Standard)',
    help: 'CC0 Zombie_Walk_Fwd_Loop from Quaternius UAL2',
  },
  {
    id: 'q-swim',
    label: 'Quaternius · Swim',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Swim_Fwd_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Swim_Fwd_Loop from Quaternius UAL',
  },
  {
    id: 'q-push',
    label: 'Quaternius · Push',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Push_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 Push_Loop from Quaternius UAL',
  },

  // —— three.js example BVH (demo; verify provenance before shipping) ——
  {
    id: 'three-pirouette',
    label: 'Three.js · Pirouette',
    source: 'three-bvh',
    format: 'bvh',
    boneProfile: 'pirouette',
    file: 'body-motion/three-bvh/pirouette.bvh',
    license: 'three.js examples redistrib — verify upstream before commercial ship',
    help: 'Pirouette BVH from three.js examples (experimental bone map)',
  },
];

/** Libraries researched but not shipped (license / size / tooling). */
export const BODY_MOTION_LIBRARY_NOTES = [
  {
    name: 'Adobe Mixamo',
    url: 'https://www.mixamo.com/',
    license: 'Royalty-free commercial; no raw asset packs; no ML training',
    status: 'wired',
  },
  {
    name: 'CMU Graphics Lab MoCap',
    url: 'http://mocap.cs.cmu.edu/',
    license: 'Free research & commercial; do not resell raw data',
    status: 'wired (BVH samples)',
  },
  {
    name: 'Quaternius Universal Animation Library',
    url: 'https://quaternius.com/',
    license: 'CC0 1.0',
    status: 'wired (free-tier glTF)',
  },
  {
    name: 'Mesh2Motion',
    url: 'https://github.com/Mesh2Motion/mesh2motion-app',
    license: 'OSS web auto-rig + Quaternius packs (CC0 assets repo)',
    status: 'tooling — recommended for custom clips',
  },
  {
    name: 'Bandai Namco Research Motiondataset',
    url: 'https://github.com/BandaiNamcoResearchInc/Bandai-Namco-Research-Motiondataset',
    license: 'CC BY-NC 4.0 — non-commercial only',
    status: 'excluded (NC)',
  },
  {
    name: 'Ubisoft LaFAN1',
    url: 'https://github.com/ubisoft/ubisoft-laforge-animation-dataset',
    license: 'Research license — check before commercial',
    status: 'excluded pending legal review',
  },
];

/**
 * @param {string} id
 * @returns {BodyMotionClip | undefined}
 */
export function getBodyMotionClip(id) {
  return BODY_MOTION_CLIPS.find((c) => c.id === id);
}

/** @returns {{ source: string, clips: BodyMotionClip[] }[]} */
export function bodyMotionClipsBySource() {
  /** @type {Map<string, BodyMotionClip[]>} */
  const map = new Map();
  for (const c of BODY_MOTION_CLIPS) {
    if (!map.has(c.source)) map.set(c.source, []);
    map.get(c.source).push(c);
  }
  return [...map.entries()].map(([source, clips]) => ({ source, clips }));
}
