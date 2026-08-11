/**
 * Finger articulation — expand fist/open/spread into per-digit curls.
 * Pure generation; drives hand DOF packs.
 */

/**
 * Ease curl so pinky closes slightly ahead of index on a fist (natural cascade).
 * @param {number} fist 0..1
 * @param {number} rank 0=thumb .. 4=pinky
 * @param {number} [handOpen=0.35]
 */
export function digitCurl(fist, rank, handOpen = 0.35) {
  const f = Math.max(0, Math.min(1, Number(fist) || 0));
  const o = Math.max(0, Math.min(1, Number(handOpen) || 0));
  const cascade = 0.08 * rank;
  const curl = Math.max(0, Math.min(1, f * (0.85 + cascade) - o * 0.25 * (1 - f)));
  return Number(curl.toFixed(4));
}

/**
 * Spread between fingers (inverse of fist, boosted by handOpen).
 * @param {number} fist
 * @param {number} [handOpen=0.35]
 * @param {number} [explicit]
 */
export function fingerSpread(fist, handOpen = 0.35, explicit) {
  if (typeof explicit === 'number') return Math.max(0, Math.min(1, explicit));
  const f = Math.max(0, Math.min(1, Number(fist) || 0));
  const o = Math.max(0, Math.min(1, Number(handOpen) || 0));
  return Number(Math.max(0, Math.min(1, o * (1 - f * 0.85))).toFixed(4));
}

/**
 * Build bilateral finger joint targets from a gesture bag.
 * @param {{
 *   fist?: number,
 *   handOpen?: number,
 *   spread?: number,
 *   armL?: object,
 *   armR?: object,
 * }} gesture
 * @returns {Record<string, number>}
 */
export function articulateFingers(gesture = {}) {
  const g = gesture || {};
  const fist = typeof g.fist === 'number' ? g.fist : 0;
  const handOpen = typeof g.handOpen === 'number' ? g.handOpen : 0.35;
  const spread = fingerSpread(fist, handOpen, g.spread);

  /**
   * @param {'L'|'R'} side
   * @param {object} arm
   */
  function sideJoints(side, arm = {}) {
    const f = typeof arm.fist === 'number' ? arm.fist : fist;
    const o = typeof arm.handOpen === 'number' ? arm.handOpen : handOpen;
    const s = typeof arm.spread === 'number' ? arm.spread : spread;
    const thumb =
      typeof arm.thumb === 'number' ? arm.thumb : digitCurl(f, 0, o) * 0.9 + 0.1;
    const index = typeof arm.index === 'number' ? arm.index : digitCurl(f, 1, o);
    const middle = typeof arm.middle === 'number' ? arm.middle : digitCurl(f, 2, o);
    const ring = typeof arm.ring === 'number' ? arm.ring : digitCurl(f, 3, o);
    const pinky = typeof arm.pinky === 'number' ? arm.pinky : digitCurl(f, 4, o);
    return {
      [`hand_${side}_fist`]: f,
      [`hand_${side}_open`]: Math.max(0, o * (1 - f)),
      [`thumb_${side}`]: thumb,
      [`index_${side}`]: index,
      [`middle_${side}`]: middle,
      [`ring_${side}`]: ring,
      [`pinky_${side}`]: pinky,
      [`spread_${side}`]: s,
    };
  }

  return {
    ...sideJoints('L', g.armL),
    ...sideJoints('R', g.armR),
  };
}
