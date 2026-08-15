/**
 * Open / commercial-friendly human head & face references for Face Live.
 * Sakura stays the brand hero — these are interop / research viewers.
 */

/** @typedef {'gltf'|'fbx'} HeadFormat */

/**
 * @typedef {object} HumanHeadRef
 * @property {string} id
 * @property {string} label
 * @property {HeadFormat} format
 * @property {string} url absolute path from Face Live static root
 * @property {string} license
 * @property {string} help
 * @property {boolean} [arkit52] true when mesh exposes ARKit-style morph names
 * @property {boolean} [sakura] true for the brand character (uses LO/HI + tex LOD)
 * @property {'rocketbox'} [texturePack] remap FBX .tga → in-repo PNGs
 */

const RB =
  '/assets/reference/human-head/rocketbox/Female_Adult_01';

/** @type {HumanHeadRef[]} */
export const HUMAN_HEAD_REFS = [
  {
    id: 'sakura',
    label: 'Sakura · hero (JP female)',
    format: 'gltf',
    url: '',
    license: 'Amoji / in-house (MB-Lab lineage — AGPL care)',
    help: 'Brand character · Mesh LOD + texture LOD',
    sakura: true,
  },
  {
    id: 'facecap',
    label: 'three.js facecap · ARKit 52',
    format: 'gltf',
    url: '/assets/reference/arkit/facecap.glb',
    license: 'MIT (three.js examples)',
    help: 'Realtime ARKit 52 blendshape reference',
    arkit52: true,
  },
  {
    id: 'valid-asian-f1',
    label: 'VALID Asian_F_1_Busi · ARKit',
    format: 'gltf',
    url: '/assets/reference/human-head/valid-vrm/Asian_F_1/Asian_F_1_Busi.glb',
    license: 'CC BY 4.0 — Google VALID + TLTMedia (attribute)',
    help: 'Inclusive Asian female with ARKit 52 morphs',
    arkit52: true,
  },
  {
    id: 'rocketbox-f01-facial',
    label: 'Rocketbox Female_Adult_01 · facial',
    format: 'fbx',
    url: `${RB}/Export/Female_Adult_01_facial.fbx`,
    license: 'MIT (Microsoft Rocketbox)',
    help: 'Facial FBX with AK_## ARKit 52 morphs + remapped PNG maps',
    texturePack: 'rocketbox',
    arkit52: true,
  },
  {
    id: 'rocketbox-f01-body',
    label: 'Rocketbox Female_Adult_01 · body',
    format: 'fbx',
    url: `${RB}/Export/Female_Adult_01.fbx`,
    license: 'MIT (Microsoft Rocketbox)',
    help: 'Body export FBX + remapped PNG maps',
    texturePack: 'rocketbox',
  },
  {
    id: 'quaternius-mannequin-f',
    label: 'Quaternius · Female mannequin (full body)',
    format: 'gltf',
    url: '/assets/characters/jp-female-v0/full-body/quaternius-mannequin-f/Mannequin_F.glb',
    license: 'CC0 1.0 (Quaternius UAL2 Standard)',
    help: 'Humanoid female mannequin for retarget / body-motion tests',
  },
  {
    id: 'mpfb-fullbody',
    label: 'MPFB · full body (CC0)',
    format: 'gltf',
    url: '/assets/characters/jp-female-v0/full-body/mpfb/mpfb.glb',
    license: 'CC0 — MakeHuman/MPFB via TalkingHead example',
    help: 'Parametric human with ARKit + Oculus visemes (TalkingHead sample)',
    arkit52: true,
  },
];

/** @param {string} id */
export function getHumanHeadRef(id) {
  return HUMAN_HEAD_REFS.find((h) => h.id === id) || HUMAN_HEAD_REFS[0];
}

/**
 * three.js LoadingManager URL modifier: Rocketbox FBX references
 * `…/f001_*.tga` — map to vendored PNGs.
 * @param {string} url
 * @param {string} [texBase]
 */
export function remapRocketboxTextureUrl(
  url,
  texBase = `${RB}/Textures/`,
) {
  const file = String(url).split(/[/\\]/).pop() || '';
  const m = file.match(/^(f001_[\w]+)\.(tga|png)$/i);
  if (m) return `${texBase}${m[1]}.png`;
  return url;
}

/**
 * @param {typeof import('three')} THREE
 * @param {new (manager?: import('three').LoadingManager) => import('three/examples/jsm/loaders/FBXLoader.js').FBXLoader} FBXLoader
 */
export function createRocketboxFbxLoader(THREE, FBXLoader) {
  const manager = new THREE.LoadingManager();
  manager.setURLModifier((u) => remapRocketboxTextureUrl(u));
  return new FBXLoader(manager);
}
