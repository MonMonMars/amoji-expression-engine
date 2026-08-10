import { clamp } from './intensity.js';
import { getVisemeRule } from './viseme.js';

/**
 * Extract abstract mouth channels from EmotionParams (lower face only).
 * Upper face must never be mixed here — anatomical separation.
 *
 * @param {import('../types.js').EmotionParams} emotionParams
 * @returns {{ jaw: number, width: number, corner: number }}
 */
export function emotionToMouthChannels(emotionParams = {}) {
  const jawFromCtr = Math.abs(/** @type {{d?:number}} */ (emotionParams['MO-CTR'] || {}).d ?? 0);
  const jawFromJw = Math.abs(/** @type {{d?:number}} */ (emotionParams['JW-CTR'] || {}).d ?? 0);
  const jaw = Math.max(jawFromCtr, jawFromJw);

  const moL = /** @type {{u?:number,d?:number,l?:number,r?:number}} */ (emotionParams['MO-L'] || {});
  const moR = /** @type {{u?:number,d?:number,l?:number,r?:number}} */ (emotionParams['MO-R'] || {});
  const width = ((moL.l ?? 0) + (moR.r ?? 0)) / 2;
  // corner: up positive (smile), down negative (frown)
  const corner = (((moL.u ?? 0) - (moL.d ?? 0)) + ((moR.u ?? 0) - (moR.d ?? 0))) / 2;

  return { jaw, width, corner };
}

/**
 * Resolve one mouth frame: viseme override architecture (LOCKED/CLAMPED/OPEN).
 * Replaces additive blend — LOCKED ignores emotion entirely.
 *
 * @param {string} visemeKey
 * @param {import('../types.js').EmotionParams|Record<string, number>} emotionParams
 * @param {number} [intensity=1]
 * @returns {{
 *   jaw: number,
 *   width: number,
 *   corner: number,
 *   states: { jaw: string, width: string, corner: string },
 *   viseme: string,
 * }}
 */
export function resolveMouth(visemeKey, emotionParams = {}, intensity = 1) {
  const { key, rule } = getVisemeRule(visemeKey);
  const channels =
    typeof emotionParams.jaw === 'number' ||
    typeof emotionParams.corner === 'number' ||
    typeof emotionParams.width === 'number'
      ? {
          jaw: Number(emotionParams.jaw ?? 0),
          width: Number(emotionParams.width ?? 0),
          corner: Number(emotionParams.corner ?? 0),
        }
      : emotionToMouthChannels(/** @type {import('../types.js').EmotionParams} */ (emotionParams));

  /** @type {{ jaw: number, width: number, corner: number }} */
  const result = { jaw: 0, width: 0, corner: 0 };
  /** @type {{ jaw: string, width: string, corner: string }} */
  const states = { jaw: 'OPEN', width: 'OPEN', corner: 'OPEN' };

  for (const param of /** @type {const} */ (['jaw', 'width', 'corner'])) {
    const spec = rule[param];
    states[param] = spec.state;
    const emotionContribution = channels[param] * intensity;

    if (spec.state === 'LOCKED') {
      // Viseme owns 100% — emotion ignored (no additive leakage).
      result[param] = spec.value;
    } else if (spec.state === 'CLAMPED') {
      const range = spec.range ?? 0;
      const base = spec.value;
      result[param] = clamp(base + emotionContribution, base + range);
      // Also floor at base - range (bidirectional). clamp() only does [0,cap], so:
      const lo = base - range;
      const hi = base + range;
      result[param] = Math.min(hi, Math.max(lo, base + emotionContribution));
    } else {
      // OPEN — emotion owns; for jaw/width fall back to viseme value if emotion is ~0
      if (param === 'corner') {
        result[param] = emotionContribution;
      } else if (Math.abs(emotionContribution) > 1e-6) {
        result[param] = emotionContribution;
      } else {
        result[param] = spec.value ?? 0;
      }
    }
  }

  return { ...result, states, viseme: key };
}

/**
 * Apply resolved mouth channels back onto EmotionParams mouth points.
 * Does not touch brows/eyes/cheeks (upper-face separation).
 *
 * @param {import('../types.js').EmotionParams} emotionParams
 * @param {{ jaw: number, width: number, corner: number }} mouth
 * @returns {import('../types.js').EmotionParams}
 */
export function applyMouthToParams(emotionParams, mouth) {
  /** @type {import('../types.js').EmotionParams} */
  const out = { ...emotionParams };
  const jaw = mouth.jaw;
  const width = mouth.width;
  const corner = mouth.corner;

  out['MO-CTR'] = jaw > 0 ? { d: jaw } : {};
  out['JW-CTR'] = jaw > 0.2 ? { d: jaw * 0.7 } : emotionParams['JW-CTR'] ?? {};

  if (corner >= 0) {
    out['MO-L'] = { u: corner, l: width };
    out['MO-R'] = { u: corner, r: width };
  } else {
    out['MO-L'] = { d: -corner, l: width };
    out['MO-R'] = { d: -corner, r: width };
  }

  out.jawOpen = jaw;
  out.mouthWidth = width;
  out.mouthCorner = corner;
  return out;
}
