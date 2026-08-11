/**
 * Compound Emotion Engine — region-locked blends (not 50/50 averages).
 */
import compoundData from '../../data/compounds/region-ownership.json' with { type: 'json' };
import { evaluateEmotion } from './emotionFormulas.js';
import { recipeForIntensity, HI_RECIPES } from './emotionMorphs.js';
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const COMPOUNDS = compoundData.compounds;
export const DEFAULT_OWNERSHIP = compoundData.defaultOwnership;

/**
 * @param {string} key morph or point id
 * @returns {'brow'|'eye'|'cheek'|'mouth'|'nose'|'jaw'|'other'}
 */
export function classifyFaceRegion(key) {
  const k = String(key);
  if (/brow|EB-|FH-|GLB|Expressions_brow/i.test(k)) return 'brow';
  if (/eye|EY-|PL-|pupil|Expressions_eye|Expressions_pupils/i.test(k)) return 'eye';
  if (/cheek|CH-|Expressions_cheek/i.test(k)) return 'cheek';
  if (/nose|NS-|nostril|Expressions_nostril/i.test(k)) return 'nose';
  if (/jaw|JW-|Expressions_jaw/i.test(k)) return 'jaw';
  if (/mouth|MO-|UL-|LL-|lip|Expressions_mouth|Expressions_tongue/i.test(k)) return 'mouth';
  return 'other';
}

/**
 * @param {string} compoundId
 */
export function getCompound(compoundId) {
  return COMPOUNDS[compoundId] || null;
}

/**
 * Merge two param/morph maps by region ownership.
 * @param {Record<string, any>} primaryMap
 * @param {Record<string, any>} secondaryMap
 * @param {Record<string, string>} ownership
 */
export function mergeByRegion(primaryMap, secondaryMap, ownership) {
  const own = { ...DEFAULT_OWNERSHIP, ...ownership };
  /** @type {Record<string, any>} */
  const out = {};
  const keys = new Set([...Object.keys(primaryMap || {}), ...Object.keys(secondaryMap || {})]);
  for (const key of keys) {
    // keep global axes from primary unless eye-related pupils from secondary owner
    if (['valence', 'arousal'].includes(key)) {
      out[key] = primaryMap[key];
      continue;
    }
    if (/^pupil/i.test(key)) {
      const src = own.eye === 'secondary' ? secondaryMap : primaryMap;
      if (src[key] !== undefined) out[key] = src[key];
      continue;
    }
    const region = classifyFaceRegion(key);
    if (region === 'other') {
      if (primaryMap[key] !== undefined) out[key] = primaryMap[key];
      continue;
    }
    const which = own[region] || 'primary';
    const src = which === 'secondary' ? secondaryMap : primaryMap;
    if (src[key] !== undefined) out[key] = src[key];
  }
  return out;
}

/**
 * Evaluate a named compound emotion → EmotionParams (2D / formula path).
 * @param {string} compoundId
 * @param {number} [intensity=1]
 * @param {{ unlockOverdrive?: boolean }} [opts]
 */
export function evaluateCompound(compoundId, intensity = 1, opts = {}) {
  const def = getCompound(compoundId);
  if (!def) throw new Error(`Unknown compound: ${compoundId}`);
  const primary = evaluateEmotion(def.primary, intensity, opts);
  const secondary = evaluateEmotion(def.secondary, intensity, opts);
  const params = mergeByRegion(primary.params, secondary.params, def.ownership);
  return applyComplianceGate(
    {
      kind: 'compound_emotion',
      emotion: compoundId,
      label: def.label,
      primary: def.primary,
      secondary: def.secondary,
      intensity,
      params,
      ownership: def.ownership,
    },
    {},
  );
}

/**
 * Build HI morph weights for a compound (Face Live path).
 * @param {string} compoundId
 * @param {number} intensity
 * @param {string[]} availableMorphs
 */
export function compoundToMorphWeights(compoundId, intensity, availableMorphs) {
  const def = getCompound(compoundId);
  if (!def) return {};
  const primary = recipeForIntensity(def.primary, intensity);
  const secondary = recipeForIntensity(def.secondary, intensity);
  const merged = mergeByRegion(primary, secondary, def.ownership);
  /** @type {Record<string, number>} */
  const weights = {};
  const available = new Set(availableMorphs);
  for (const [k, v] of Object.entries(merged)) {
    if (available.has(k) && typeof v === 'number') weights[k] = Math.min(1, v);
  }
  // Fallback EMO_ if no Expression keys matched
  if (Object.keys(weights).length === 0) {
    const peak = `EMO_${def.primary}`;
    if (available.has(peak)) weights[peak] = intensity;
  }
  return weights;
}

export { HI_RECIPES };
