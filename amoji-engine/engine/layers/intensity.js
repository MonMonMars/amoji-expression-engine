/**
 * Intensity scale helpers.
 * 0 = neutral | 1 = human physiological limit | >1 = stylized / robot overdrive
 */

/** @param {number} value @param {number} [cap=1] */
export function clamp(value, cap = 1) {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > cap) return cap;
  return value;
}

/**
 * @param {number} t
 * @param {{ unlockOverdrive?: boolean, softCap?: number }} [opts]
 * @returns {{ t: number, overdrive: boolean, warned: boolean }}
 */
export function resolveIntensity(t, opts = {}) {
  const unlockOverdrive = opts.unlockOverdrive === true;
  const softCap = opts.softCap ?? 1.6;
  let warned = false;
  let overdrive = false;
  let out = t;

  if (t > 1) {
    overdrive = true;
    warned = true;
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(
        `[amoji] intensity ${t} exceeds human physiological range (1.0)`,
      );
    }
    if (!unlockOverdrive) {
      out = 1;
      overdrive = false;
    } else {
      out = clamp(t, softCap);
    }
  } else if (t < 0) {
    out = 0;
  }

  return { t: out, overdrive, warned };
}
