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
    id: 'q-idle',
    label: 'Quaternius · Idle',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Idle_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 idle loop from Quaternius UAL (Godot/glTF standard)',
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
    help: 'CC0 walk loop from Quaternius UAL',
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
    help: 'CC0 jog loop from Quaternius UAL',
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
    help: 'CC0 dance loop from Quaternius UAL',
  },
  {
    id: 'q-wave-talk',
    label: 'Quaternius · Talk idle',
    source: 'quaternius',
    format: 'gltf',
    boneProfile: 'quaternius',
    file: 'body-motion/quaternius/AnimationLibrary_Godot_Standard.gltf',
    animationName: 'Idle_Talking_Loop',
    license: 'CC0 1.0 (Quaternius Universal Animation Library — free tier)',
    help: 'CC0 talking idle — pairs well with Face Live TTS',
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
