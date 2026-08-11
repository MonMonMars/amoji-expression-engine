/**
 * Capcom-style texture LOD — swap material maps without changing mesh LOD.
 */

/** @typedef {'hi'|'mid'|'lo'} TexLod */

export const TEX_LODS = ['hi', 'mid', 'lo'];

/**
 * @param {string} baseUrl e.g. '/assets/characters/jp-female-v0/'
 * @param {TexLod} tier
 */
export function texturePackUrls(baseUrl, tier) {
  const root = baseUrl.replace(/\/?$/, '/');
  const t = root + `lod/textures/${tier}/`;
  return {
    tier,
    albedo: `${t}albedo.png`,
    eyelash: `${t}eyelash.png`,
    sclera: `${t}sclera.png`,
    teeth: `${t}teeth.png`,
  };
}

/**
 * @param {string} materialName
 */
export function classifyMaterial(materialName) {
  const n = (materialName || '').toLowerCase();
  if (n.includes('eyelash')) return 'eyelash';
  if (n.includes('skin')) return 'skin';
  if (n.includes('human_eyes') || n.includes('sclera')) return 'sclera';
  if (n.includes('teeth')) return 'teeth';
  if (n.includes('tongue')) return 'tongue';
  return null;
}

/**
 * Load a texture pack and apply to all meshes under `root`.
 * @param {import('three')} THREE
 * @param {import('three').Object3D} root
 * @param {ReturnType<typeof texturePackUrls>} urls
 * @param {{ anisotropy?: number }} [opts]
 * @returns {Promise<{ applied: number, tier: string }>}
 */
export async function applyTexturePack(THREE, root, urls, opts = {}) {
  const loader = new THREE.TextureLoader();
  const anisotropy = opts.anisotropy ?? 4;

  /** @param {string} url */
  const load = (url) =>
    new Promise((resolve, reject) => {
      loader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = anisotropy;
          tex.flipY = false; // glTF / embedded maps are typically flipY=false
          tex.needsUpdate = true;
          resolve(tex);
        },
        undefined,
        reject,
      );
    });

  const [albedo, eyelash, sclera, teeth] = await Promise.all([
    load(urls.albedo),
    load(urls.eyelash),
    load(urls.sclera),
    load(urls.teeth),
  ]);

  const byRole = {
    skin: albedo,
    eyelash,
    sclera,
    teeth,
    tongue: teeth,
  };

  let applied = 0;
  root.traverse((c) => {
    if (!c.isMesh || !c.material) return;
    const mats = Array.isArray(c.material) ? c.material : [c.material];
    for (const m of mats) {
      const role = classifyMaterial(m.name);
      if (!role || !byRole[role]) continue;
      const prev = m.map;
      m.map = byRole[role];
      // Skin often ships without a map in the GLB — force-lit albedo.
      if (role === 'skin') {
        m.color?.setRGB(1, 1, 1);
        m.metalness = Math.min(m.metalness ?? 0, 0.05);
        m.roughness = m.roughness ?? 0.55;
      }
      m.needsUpdate = true;
      if (prev && prev !== m.map) prev.dispose?.();
      applied += 1;
    }
  });

  return { applied, tier: urls.tier };
}
