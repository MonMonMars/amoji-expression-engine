/**
 * Cohen–Massaro (1993) dominance-function coarticulation.
 * Continuous blend of adjacent visemes on jaw / width / corner articulators.
 */
import dominanceData from '../../data/visemes/cohen-massaro-dominance.json' with { type: 'json' };
import { normalizeVisemeKey, getVisemeRule, textToVisemeSequence } from './viseme.js';
import { resolveMouth, applyMouthToParams } from './resolveMouth.js';

export const DOMINANCE_TABLE = dominanceData.dominance;
export const ARTICULATORS = dominanceData.articulators;

/**
 * Negative-exponential dominance at time relative to phoneme onset.
 * @param {string} viseme
 * @param {'jaw'|'width'|'corner'} articulator
 * @param {number} tRelative seconds (negative = before onset)
 */
export function dominanceWeight(viseme, articulator, tRelative) {
  const key = normalizeVisemeKey(viseme);
  const row = DOMINANCE_TABLE[key]?.[articulator];
  if (!row) return 0;
  const { peakMagnitude, anticipatoryRate, carryoverRate } = row;
  if (tRelative < 0) {
    return peakMagnitude * Math.exp(anticipatoryRate * tRelative);
  }
  return peakMagnitude * Math.exp(-carryoverRate * tRelative);
}

/**
 * Target shape value for an articulator from Preston Blair viseme table.
 * @param {string} viseme
 * @param {'jaw'|'width'|'corner'} articulator
 */
export function visemeTarget(viseme, articulator) {
  const { rule } = getVisemeRule(viseme);
  return Number(rule[articulator]?.value ?? 0);
}

/**
 * @typedef {{ viseme: string, onset: number, char?: string }} TimedViseme
 */

/**
 * Build a timed viseme sequence (equal char slots by default).
 * @param {string} text
 * @param {{ charDuration?: number }} [opts] seconds per character
 * @returns {TimedViseme[]}
 */
export function timedVisemeSequence(text, opts = {}) {
  const charDuration = opts.charDuration ?? 0.08;
  const seq = textToVisemeSequence(text);
  return seq.map((item, i) => ({
    ...item,
    onset: i * charDuration,
  }));
}

/**
 * Resolve one articulator at absolute time t via weighted dominance mix.
 * @param {TimedViseme[]} sequence
 * @param {number} t
 * @param {'jaw'|'width'|'corner'} articulator
 * @param {{ weightEps?: number }} [opts]
 */
export function resolveArticulatorAtTime(sequence, t, articulator, opts = {}) {
  const eps = opts.weightEps ?? 0.01;
  let weightedSum = 0;
  let totalWeight = 0;
  let mbpWeight = 0;

  for (const item of sequence) {
    const w = dominanceWeight(item.viseme, articulator, t - item.onset);
    if (w <= eps) continue;
    weightedSum += w * visemeTarget(item.viseme, articulator);
    totalWeight += w;
    if (normalizeVisemeKey(item.viseme) === 'MBP') mbpWeight += w;
  }

  if (totalWeight < eps) {
    return { value: visemeTarget('REST', articulator), totalWeight: 0, mbpWeight: 0 };
  }

  let value = weightedSum / totalWeight;

  // Bilabial closure must win when MBP dominates (JALI / Preston Blair hard rule)
  if (articulator === 'jaw' && mbpWeight / totalWeight >= 0.35) {
    value = 0;
  }

  return { value, totalWeight, mbpWeight };
}

/**
 * Full mouth channels at time t.
 * @param {TimedViseme[]} sequence
 * @param {number} t
 * @param {import('../types.js').EmotionParams|Record<string, number>} [emotionParams]
 * @param {number} [intensity=1]
 */
export function resolveMouthAtTime(sequence, t, emotionParams = {}, intensity = 1) {
  const jawR = resolveArticulatorAtTime(sequence, t, 'jaw');
  const widthR = resolveArticulatorAtTime(sequence, t, 'width');
  const cornerR = resolveArticulatorAtTime(sequence, t, 'corner');

  // Seed resolveMouth with continuous targets as "emotion" channels under OPEN/CLAMPED,
  // then force LOCKED viseme synthesis via a synthetic proxy when MBP dominates.
  const continuous = {
    jaw: jawR.value,
    width: widthR.value,
    corner: cornerR.value,
  };

  if (jawR.mbpWeight / Math.max(jawR.totalWeight, 1e-6) >= 0.35) {
    const locked = resolveMouth('MBP', emotionParams, intensity);
    return {
      ...locked,
      jaw: 0,
      width: continuous.width,
      coarticulated: true,
      dominance: { jaw: jawR, width: widthR, corner: cornerR },
    };
  }

  // Blend continuous targets with emotion via CLAMPED/OPEN of nearest peak viseme
  const peak = peakVisemeAt(sequence, t);
  const base = resolveMouth(peak, emotionParams, intensity);
  return {
    jaw: continuous.jaw,
    width: continuous.width,
    // corner: allow emotion OPEN contribution lightly
    corner: continuous.corner * 0.65 + base.corner * 0.35,
    states: base.states,
    viseme: peak,
    coarticulated: true,
    dominance: { jaw: jawR, width: widthR, corner: cornerR },
  };
}

/**
 * Viseme with max total dominance at t (for labeling).
 * @param {TimedViseme[]} sequence
 * @param {number} t
 */
export function peakVisemeAt(sequence, t) {
  let best = 'REST';
  let bestW = -1;
  for (const item of sequence) {
    let w = 0;
    for (const a of ARTICULATORS) {
      w += dominanceWeight(item.viseme, a, t - item.onset);
    }
    if (w > bestW) {
      bestW = w;
      best = normalizeVisemeKey(item.viseme);
    }
  }
  return best;
}

/**
 * Sample a continuous speech timeline into frames.
 * @param {string} text
 * @param {{
 *   fps?: number,
 *   charDuration?: number,
 *   emotionParams?: object,
 *   intensity?: number,
 * }} [opts]
 */
export function sampleCoarticulatedFrames(text, opts = {}) {
  const fps = opts.fps ?? 30;
  const charDuration = opts.charDuration ?? 0.08;
  const intensity = opts.intensity ?? 1;
  const emotionParams = opts.emotionParams ?? {};
  const sequence = timedVisemeSequence(text, { charDuration });
  const duration = Math.max(charDuration, sequence.length * charDuration + 0.12);
  const dt = 1 / fps;
  /** @type {object[]} */
  const frames = [];
  for (let t = 0; t <= duration + 1e-9; t += dt) {
    const mouth = resolveMouthAtTime(sequence, t, emotionParams, intensity);
    frames.push({
      t,
      mouth,
      params: applyMouthToParams(emotionParams, mouth),
      viseme: mouth.viseme,
    });
  }
  return { sequence, duration, frames, fps };
}
