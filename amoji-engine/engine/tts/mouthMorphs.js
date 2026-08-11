/**
 * Map resolveMouth channels → Sakura Expression_* morph weights (overlay).
 * @param {{ jaw?: number, width?: number, corner?: number }} mouth
 * @param {string[]} [available]
 */
export function mouthChannelsToMorphWeights(mouth, available) {
  const jaw = Math.max(0, mouth?.jaw ?? 0);
  const width = Math.max(0, mouth?.width ?? 0);
  const corner = mouth?.corner ?? 0;
  /** @type {Record<string, number>} */
  const w = {};

  const set = (name, v) => {
    if (v <= 0.01) return;
    if (available && !available.includes(name)) return;
    w[name] = Math.min(1, Math.max(w[name] || 0, v));
  };

  set('Expressions_mouthOpenLarge_max', jaw * 1.05);
  set('Expressions_mouthOpenAggr_max', jaw * 0.55);
  set('Expressions_mouthOpen_max', jaw * 0.9);

  if (corner >= 0) {
    set('Expressions_mouthSmile_max', corner * 0.85);
    set('Expressions_mouthSmileL_max', corner * 0.7);
    set('Expressions_mouthSmileR_max', corner * 0.7);
    set('Expressions_mouthSmileOpen_max', corner * jaw * 0.9);
  } else {
    const f = -corner;
    set('Expressions_mouthSmile_min', f * 0.8);
    set('Expressions_mouthLowerOut_max', f * 0.35);
  }

  if (width > 0.4) {
    set('Expressions_mouthHoriz_max', (width - 0.35) * 0.8);
  } else if (width < 0.25) {
    set('Expressions_mouthHoriz_min', (0.35 - width) * 0.9);
  }

  // MBP closure: force closed mouth
  if (jaw < 0.05 && width > 0.7) {
    set('Expressions_mouthClosed_max', 0.55);
  }

  return w;
}
