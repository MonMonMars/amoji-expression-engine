/**
 * Map Amoji Expression_* morph weights and/or M1–M21 activations → ARKit 52.
 */
import mappingData from '../../data/arkit/arkit-mapping.json';

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
