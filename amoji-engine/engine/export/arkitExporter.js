/**
 * Map Amoji Expression_* morph weights and/or M1–M21 activations → ARKit 52.
 */
import mappingData from '../../data/arkit/arkit-mapping.json' with { type: 'json' };

export const ARKIT_CHANNELS = mappingData.channels;
export const ARKIT_MAPPING = mappingData;

/**
 * @returns {Record<string, number>} zeroed ARKit vector
 */
export function emptyArkitWeights() {
  /** @type {Record<string, number>} */
  const out = {};
  for (const c of ARKIT_CHANNELS) out[c] = 0;
  return out;
}

/**
 * Accumulate source→target weighted contributions into an ARKit vector.
 * @param {Record<string, number>} out
 * @param {Record<string, number>} sourceWeights
 * @param {Record<string, Array<{target: string, weight: number}>>} table
 */
function accumulate(out, sourceWeights, table) {
  for (const [src, value] of Object.entries(sourceWeights)) {
    if (!value || value <= 0) continue;
    const routes = table[src];
    if (!routes) continue;
    for (const { target, weight } of routes) {
      if (!(target in out)) continue;
      out[target] = Math.min(1, out[target] + value * weight);
    }
  }
  return out;
}

/**
 * @param {Record<string, number>} morphWeights Expression_* / EMO_* keys
 * @param {{ mapping?: typeof mappingData }} [opts]
 */
export function morphWeightsToArkit(morphWeights, opts = {}) {
  const mapping = opts.mapping || ARKIT_MAPPING;
  const out = emptyArkitWeights();
  accumulate(out, morphWeights, mapping.expressionToArkit);

  // Combined EMO_* shapes have no direct Expression keys — leave 0 unless
  // callers expand emotion via emotionToMorphWeights (HI recipes) first.
  return out;
}

/**
 * @param {Record<string, number>} muscleActivations e.g. { M1: 0.4, M10: 0.8 }
 * @param {{ mapping?: typeof mappingData }} [opts]
 */
export function muscleActivationsToArkit(muscleActivations, opts = {}) {
  const mapping = opts.mapping || ARKIT_MAPPING;
  const out = emptyArkitWeights();
  accumulate(out, muscleActivations, mapping.muscleToArkit);
  return out;
}

/**
 * Max-merge two ARKit vectors (useful when combining expression + muscle paths).
 * @param {Record<string, number>} a
 * @param {Record<string, number>} b
 */
export function mergeArkitWeights(a, b) {
  const out = emptyArkitWeights();
  for (const c of ARKIT_CHANNELS) {
    out[c] = Math.min(1, Math.max(a[c] || 0, b[c] || 0));
  }
  return out;
}

/**
 * Compact dump of non-zero channels for HUD / JSON export.
 * @param {Record<string, number>} weights
 * @param {number} [eps=0.01]
 */
export function arkitNonZero(weights, eps = 0.01) {
  return Object.fromEntries(
    Object.entries(weights)
      .filter(([, v]) => v > eps)
      .sort((a, b) => b[1] - a[1]),
  );
}

/**
 * Apple ARKit `eyeBlinkLeft` ↔ three.js facecap `eyeBlink_L` (and Right/_R).
 * @param {string} name
 * @returns {string | null}
 */
export function arkitNameAlias(name) {
  if (!name) return null;
  if (name.endsWith('Left')) return `${name.slice(0, -4)}_L`;
  if (name.endsWith('Right')) return `${name.slice(0, -5)}_R`;
  if (name.endsWith('_L')) return `${name.slice(0, -2)}Left`;
  if (name.endsWith('_R')) return `${name.slice(0, -2)}Right`;
  return null;
}

/**
 * Rocketbox Headbox style: `AK_09_EyeBlinkLeft` → `eyeBlinkLeft`.
 * @param {string} name
 * @returns {string | null}
 */
export function rocketboxAkToArkitChannel(name) {
  const m = String(name || '').match(/^AK_\d{2}_([A-Za-z]+)$/);
  if (!m) return null;
  const pascal = m[1];
  const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);
  return ARKIT_CHANNELS.includes(camel) ? camel : null;
}

/**
 * Build channel → mesh morph name index for Apple / facecap / Rocketbox AK_*.
 * @param {string[] | Set<string>} availableMorphs
 * @returns {Map<string, string>}
 */
export function buildArkitMorphNameIndex(availableMorphs) {
  /** @type {Map<string, string>} */
  const index = new Map();
  const list = availableMorphs instanceof Set
    ? [...availableMorphs]
    : availableMorphs || [];

  for (const name of list) {
    if (ARKIT_CHANNELS.includes(name) && !index.has(name)) {
      index.set(name, name);
    }
    const fromAk = rocketboxAkToArkitChannel(name);
    if (fromAk && !index.has(fromAk)) {
      index.set(fromAk, name);
    }
  }

  // Underscore facecap aliases (prefer exact Apple name if already indexed)
  for (const name of list) {
    if (name.includes('_') && (name.endsWith('_L') || name.endsWith('_R'))) {
      const apple = arkitNameAlias(name);
      if (apple && ARKIT_CHANNELS.includes(apple) && !index.has(apple)) {
        index.set(apple, name);
      }
    }
  }

  // If only underscore present and Apple not in list, already handled above.
  // Also map Apple→underscore when mesh only has underscore:
  for (const ch of ARKIT_CHANNELS) {
    if (index.has(ch)) continue;
    const und = arkitNameAlias(ch);
    if (und && list.includes(und)) index.set(ch, und);
  }

  return index;
}

/**
 * Remap an ARKit-52 weight vector onto whatever morph names a mesh exposes
 * (Apple camelCase, facecap underscore L/R, or Rocketbox `AK_##_Pascal`).
 * @param {Record<string, number>} arkitWeights
 * @param {string[] | Set<string>} availableMorphs
 * @returns {Record<string, number>}
 */
export function remapArkitWeightsToMorphNames(arkitWeights, availableMorphs) {
  const index = buildArkitMorphNameIndex(availableMorphs);
  /** @type {Record<string, number>} */
  const out = {};
  for (const [ch, v] of Object.entries(arkitWeights || {})) {
    if (!(v > 0.001)) continue;
    const meshName = index.get(ch);
    if (!meshName) continue;
    out[meshName] = Math.max(out[meshName] || 0, Math.min(1, v));
  }
  return out;
}

/**
 * Convert Sakura Expression_* / EMO_* targets → mesh morph weights for an
 * ARKit-52 reference head (facecap / VALID / Rocketbox AK_*).
 * @param {Record<string, number>} sakuraMorphWeights
 * @param {string[]} availableMorphs
 * @param {{ mapping?: typeof mappingData }} [opts]
 */
export function sakuraMorphsToArkitMeshWeights(
  sakuraMorphWeights,
  availableMorphs,
  opts = {},
) {
  const arkit = morphWeightsToArkit(sakuraMorphWeights, opts);
  return remapArkitWeightsToMorphNames(arkit, availableMorphs);
}

