/**
 * Eye look-at → MB-Lab Expressions_eyesHoriz/Vert morph weights.
 * lookX/Y in [-1, 1]: +X = character's left (screen-right when facing camera),
 * +Y = up.
 */

/**
 * @param {number} lookX -1..1
 * @param {number} lookY -1..1
 * @param {string[]} availableMorphs
 * @param {{ gain?: number }} [opts]
 * @returns {Record<string, number>}
 */
export function lookToEyeMorphWeights(lookX, lookY, availableMorphs, opts = {}) {
  const gain = opts.gain ?? 1;
  const x = Math.max(-1, Math.min(1, lookX)) * gain;
  const y = Math.max(-1, Math.min(1, lookY)) * gain;
  const available = new Set(availableMorphs);
  /** @type {Record<string, number>} */
  const weights = {};

  const set = (name, w) => {
    if (available.has(name) && w > 0.001) weights[name] = Math.min(1, w);
  };

  if (x > 0) set('Expressions_eyesHoriz_max', x);
  else if (x < 0) set('Expressions_eyesHoriz_min', -x);

  if (y > 0) set('Expressions_eyesVert_max', y);
  else if (y < 0) set('Expressions_eyesVert_min', -y);

  return weights;
}

/**
 * Micro saccade offsets (ND-style idle eye noise).
 * @param {number} elapsedTime seconds
 * @param {number} [amp=0.12]
 */
export function saccadeOffset(elapsedTime, amp = 0.12) {
  const t = elapsedTime;
  const sx = (Math.sin(t * 3.1) * 0.5 + Math.sin(t * 5.7) * 0.5) * amp;
  const sy = Math.sin(t * 2.4 + 1.7) * amp * 0.65;
  return { x: sx, y: sy };
}

/**
 * Merge look weights into an existing morph target map (max per key).
 * @param {Record<string, number>} targets
 * @param {Record<string, number>} eyeWeights
 */
export function mergeEyeWeights(targets, eyeWeights) {
  for (const [k, v] of Object.entries(eyeWeights)) {
    targets[k] = Math.max(targets[k] || 0, v);
  }
  return targets;
}
