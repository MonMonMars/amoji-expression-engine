/**
 * Map Amoji emotion ids → morph target weights for Sakura LO/HI GLBs.
 * HI uses hand-tuned intensity sculpt recipes (subtle/medium/peak, not linear scales).
 * LO crossfades baked EMO_*_{subtle,medium,peak} morphs.
 */
import sculptData from '../../data/emotions/intensity-sculpt-recipes.json' with { type: 'json' };
import { applyYouthfulSmileBias } from './smileLaugh.js';

export const EMOTIONS = [
  'happy',
  'sad',
  'angry',
  'surprised',
  'fear',
  'disgust',
  'thinking',
  'smile_open',
  'neutral',
];

/** Intensity sculpt tiers (ND-style pose density — baked in export_lod_emotions.py). */
export const INTENSITY_TIERS = sculptData.tiers;

/** Hand-tuned per-tier Expression_* recipes */
export const SCULPT_RECIPES = sculptData.recipes;

/** Peak recipes (compat alias for Face Live / temporal leak). */
export const HI_RECIPES = Object.fromEntries(
  Object.entries(SCULPT_RECIPES).map(([emo, tiers]) => [emo, tiers.peak || {}]),
);
HI_RECIPES.neutral = {};

/** Extreme-band overdrive gains (intensity 1..2). */
export const DISNEY_EXTREME_EASE_OVERDRIVE_GAIN = 1.45;
export const DISNEY_EXTREME_RECIPE_OVERDRIVE_GAIN = 0.85;
export const DISNEY_EXTREME_LO_LEGACY_OVERDRIVE_CAP = 0.5;

/**
 * Normalize glTF morph name variants (spaces / dots).
 * @param {string} name
 */
export function normalizeMorphName(name) {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Square Enix-style ease: soft in the low band, stronger near peak / Extreme.
 * @param {number} t 0..2
 */
export function easeEmotionIntensity(t) {
  const x = Math.max(0, Math.min(2.0, t));
  if (x <= 1) {
    const s = x * x * (3 - 2 * x);
    return s;
  }
  // Overdrive: cartoon punch for Disney Extreme tiers (1..2).
  return 1 + (x - 1) * DISNEY_EXTREME_EASE_OVERDRIVE_GAIN;
}

/**
 * Sample `easeEmotionIntensity` across 0..maxT for Extreme curve UI.
 * @param {{
 *   steps?: number,
 *   maxT?: number,
 *   markerT?: number,
 * }} [opts]
 * @returns {{
 *   points: { t: number, y: number }[],
 *   marker: { t: number, y: number }|null,
 *   gain: number,
 *   maxY: number,
 *   maxT: number,
 * }}
 */
export function sampleDisneyExtremeEaseCurve(opts = {}) {
  const steps = Math.max(2, Math.floor(opts.steps ?? 33));
  const maxT =
    typeof opts.maxT === 'number' && opts.maxT > 0 ? opts.maxT : 2;
  /** @type {{ t: number, y: number }[]} */
  const points = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / (steps - 1)) * maxT;
    points.push({ t, y: easeEmotionIntensity(t) });
  }
  /** @type {{ t: number, y: number }|null} */
  let marker = null;
  if (typeof opts.markerT === 'number' && Number.isFinite(opts.markerT)) {
    const t = Math.max(0, Math.min(maxT, opts.markerT));
    marker = { t, y: easeEmotionIntensity(t) };
  }
  let maxY = 0;
  for (const p of points) if (p.y > maxY) maxY = p.y;
  if (marker && marker.y > maxY) maxY = marker.y;
  return {
    points,
    marker,
    gain: DISNEY_EXTREME_EASE_OVERDRIVE_GAIN,
    maxY,
    maxT,
  };
}

/**
 * Compact label for the Extreme ease curve readout.
 * @param {{ markerT?: number, enabled?: boolean }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeEaseCurveLabel(opts = {}) {
  const gain = DISNEY_EXTREME_EASE_OVERDRIVE_GAIN;
  if (!opts.enabled) return `ease curve · od ×${gain.toFixed(2)} (off)`;
  if (typeof opts.markerT === 'number' && Number.isFinite(opts.markerT)) {
    const t = Math.max(0, Math.min(2, opts.markerT));
    return `ease ${easeEmotionIntensity(t).toFixed(2)} @ ${t.toFixed(2)} · od ×${gain.toFixed(2)}`;
  }
  return `ease curve · od ×${gain.toFixed(2)}`;
}

/**
 * Inline SVG sparkline for the Extreme ease overdrive curve.
 * @param {{
 *   width?: number,
 *   height?: number,
 *   steps?: number,
 *   maxT?: number,
 *   markerT?: number,
 *   stroke?: string,
 *   markerStroke?: string,
 *   fill?: string,
 *   peakGuide?: string,
 * }} [opts]
 * @returns {{ svg: string, empty: boolean, sample: ReturnType<typeof sampleDisneyExtremeEaseCurve> }}
 */
export function buildDisneyExtremeEaseSparkSvg(opts = {}) {
  const width = opts.width ?? 140;
  const height = opts.height ?? 28;
  const sample = sampleDisneyExtremeEaseCurve(opts);
  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const stroke = opts.stroke || '#7ec8ff';
  const markerStroke = opts.markerStroke || '#ffb454';
  const fill = opts.fill || 'rgba(126,200,255,0.14)';
  const peakGuide = opts.peakGuide || 'rgba(255,255,255,0.18)';
  const maxY = Math.max(sample.maxY, 1e-6);
  const coords = sample.points.map((p) => ({
    x: pad + (p.t / sample.maxT) * w,
    y: pad + (1 - p.y / maxY) * h,
  }));
  const poly = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const area = `${pad},${pad + h} ${poly} ${pad + w},${pad + h}`;
  const peakX = pad + (1 / sample.maxT) * w;
  let markerSvg = '';
  if (sample.marker) {
    const mx = pad + (sample.marker.t / sample.maxT) * w;
    const my = pad + (1 - sample.marker.y / maxY) * h;
    markerSvg = `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="2.4" fill="${markerStroke}" stroke="#0b1218" stroke-width="0.8"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Disney Extreme ease curve"><rect width="100%" height="100%" fill="transparent"/><line x1="${peakX.toFixed(1)}" y1="${pad}" x2="${peakX.toFixed(1)}" y2="${pad + h}" stroke="${peakGuide}" stroke-width="1" stroke-dasharray="2 2"/><polygon points="${area}" fill="${fill}" stroke="none"/><polyline points="${poly}" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>${markerSvg}</svg>`;
  return { svg, empty: false, sample };
}

/**
 * Pick / blend hand-tuned tier recipes for a continuous intensity.
 * @param {string} emotion
 * @param {number} intensity 0..2
 * @returns {Record<string, number>}
 */
export function recipeForIntensity(emotion, intensity) {
  const tiers = SCULPT_RECIPES[emotion];
  if (!tiers) return {};
  const t = Math.max(0, Math.min(2.0, intensity));
  if (t <= 0.001) return {};

  const a = INTENSITY_TIERS.subtle;
  const b = INTENSITY_TIERS.medium;
  const c = INTENSITY_TIERS.peak;

  /** @param {Record<string, number>} r @param {number} w */
  const scale = (r, w) => {
    /** @type {Record<string, number>} */
    const out = {};
    for (const [k, v] of Object.entries(r || {})) out[k] = v * w;
    return out;
  };

  /** @param {Record<string, number>} A @param {Record<string, number>} B */
  const merge = (A, B) => {
    /** @type {Record<string, number>} */
    const out = { ...A };
    for (const [k, v] of Object.entries(B)) out[k] = (out[k] || 0) + v;
    return out;
  };

  if (t <= a) {
    return scale(tiers.subtle, t / a);
  }
  if (t <= b) {
    const u = (t - a) / (b - a);
    return merge(scale(tiers.subtle, 1 - u), scale(tiers.medium, u));
  }
  if (t <= c) {
    const u = (t - b) / (c - b);
    return merge(scale(tiers.medium, 1 - u), scale(tiers.peak, u));
  }
  // overdrive: peak + larger Extreme lift
  return scale(
    tiers.peak,
    1 + (t - 1) * DISNEY_EXTREME_RECIPE_OVERDRIVE_GAIN,
  );
}

/**
 * Crossfade weights across subtle / medium / peak sculpt morphs.
 * @param {string} emotion
 * @param {number} intensity 0..2
 * @param {Set<string>} available
 * @returns {Record<string, number> | null}
 */
export function intensityTierWeights(emotion, intensity, available) {
  const subtle = `EMO_${emotion}_subtle`;
  const medium = `EMO_${emotion}_medium`;
  const peak = `EMO_${emotion}_peak`;
  const legacy = `EMO_${emotion}`;

  const hasTiers = available.has(subtle) && available.has(medium) && available.has(peak);
  if (!hasTiers) {
    if (available.has(legacy)) {
      return { [legacy]: Math.max(0, Math.min(2.0, intensity)) };
    }
    return null;
  }

  const t = Math.max(0, Math.min(2.0, intensity));
  /** @type {Record<string, number>} */
  const weights = {};
  if (t <= 0.001) return weights;

  const a = INTENSITY_TIERS.subtle;
  const b = INTENSITY_TIERS.medium;
  const c = INTENSITY_TIERS.peak;

  if (t <= a) {
    weights[subtle] = t / a;
  } else if (t <= b) {
    const u = (t - a) / (b - a);
    weights[subtle] = 1 - u;
    weights[medium] = u;
  } else if (t <= c) {
    const u = (t - b) / (c - b);
    weights[medium] = 1 - u;
    weights[peak] = u;
  } else {
    weights[peak] = 1;
    if (available.has(legacy)) {
      weights[legacy] = Math.min(
        DISNEY_EXTREME_LO_LEGACY_OVERDRIVE_CAP,
        (t - 1) * DISNEY_EXTREME_LO_LEGACY_OVERDRIVE_CAP,
      );
    }
  }

  if (weights[peak] && !available.has(peak) && available.has(legacy)) {
    weights[legacy] = (weights[legacy] || 0) + weights[peak];
    delete weights[peak];
  }

  return weights;
}

/**
 * Build a dictionary of morphName → weight for an emotion + intensity.
 * @param {'hi'|'lo'} lod
 * @param {string} emotion
 * @param {number} intensity 0..1
 * @param {string[]} availableMorphs morphTargetDictionary keys
 */
export function emotionToMorphWeights(lod, emotion, intensity, availableMorphs) {
  const t = Math.max(0, Math.min(2.0, intensity));
  /** @type {Record<string, number>} */
  const weights = {};
  const available = new Set(availableMorphs);
  const has = (n) => available.has(n);

  if (emotion === 'neutral' || t <= 0.001) {
    return weights;
  }

  if (lod === 'lo') {
    const tier = intensityTierWeights(emotion, t, available);
    if (tier) return tier;
    return weights;
  }

  // HI: hand-tuned Expression_* blend across sculpt tiers
  const recipe = recipeForIntensity(emotion, t);
  for (const [k, v] of Object.entries(recipe)) {
    if (has(k)) weights[k] = Math.min(1.6, v);
  }
  if (Object.keys(weights).length === 0) {
    const tier = intensityTierWeights(emotion, t, available);
    if (tier) return tier;
  }
  if (emotion === 'happy' || emotion === 'smile_open') {
    const kind = emotion === 'smile_open' && t >= 0.75 ? 'laughter' : 'smile';
    return applyYouthfulSmileBias(weights, { kind, intensity: t });
  }
  return weights;
}

/**
 * Apply weights to a THREE.Mesh with morph targets; lerp toward targets.
 * @param {import('three').Mesh} mesh
 * @param {Record<string, number>} targetWeights
 * @param {number} lerpAlpha
 */
export function applyMorphWeights(mesh, targetWeights, lerpAlpha = 0.25) {
  if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
  const dict = mesh.morphTargetDictionary;
  const infl = mesh.morphTargetInfluences;
  for (let i = 0; i < infl.length; i++) {
    infl[i] += (0 - infl[i]) * lerpAlpha;
  }
  for (const [name, w] of Object.entries(targetWeights)) {
    const idx = dict[name];
    if (idx === undefined) continue;
    infl[idx] += (w - infl[idx]) * lerpAlpha;
  }
}

/**
 * Merge residual Step-Out + leak overlays into emotion targets (max).
 * @param {Record<string, number>} base
 * @param {Record<string, number>} overlay
 */
export function mergeMorphOverlays(base, overlay) {
  for (const [k, v] of Object.entries(overlay || {})) {
    base[k] = Math.max(base[k] || 0, v);
  }
  return base;
}

/** Default Disney Extreme eye / mouth morph multipliers. */
export const DISNEY_EXTREME_DEFAULTS = {
  eyeFactor: 1.4,
  mouthFactor: 1.5,
  weightCap: 2.0,
  shapeFactor: 1.6,
  bodyFactor: 1.6,
  intensityCap: 2.0,
};

/** Shared Face Live Extreme hotkey catalog (help legend + key resolve). */
export const DISNEY_EXTREME_HOTKEY_CATALOG = [
  { id: 'toggle', keys: ['x', 'X'], help: 'X', kind: 'action' },
  { id: 'toggleBodyApply', keys: ['b', 'B'], help: 'B body', kind: 'action' },
  {
    id: 'nudgeShape',
    keys: { down: ['[', '{'], up: [']', '}'] },
    help: '[ ] shape',
    kind: 'nudge',
    factor: 'shape',
  },
  {
    id: 'nudgeBody',
    keys: { down: ['-', '_'], up: ['=', '+'] },
    help: '- = body×',
    kind: 'nudge',
    factor: 'body',
  },
  {
    id: 'nudgeEye',
    keys: { down: [',', '<'], up: ['.', '>'] },
    help: ', . eye',
    kind: 'nudge',
    factor: 'eye',
  },
  {
    id: 'nudgeMouth',
    keys: { down: [';', ':'], up: ["'", '"'] },
    help: "; ' mouth",
    kind: 'nudge',
    factor: 'mouth',
  },
  { id: 'copySummary', keys: ['c', 'C'], help: 'C copy', kind: 'action' },
  { id: 'resetDefaults', keys: ['r', 'R'], help: 'R reset', kind: 'action' },
  { id: 'showHelp', keys: ['h', 'H', '?'], help: 'H help', kind: 'action' },
  { id: 'showEaseCurve', keys: ['e', 'E'], help: 'E ease', kind: 'action' },
  { id: 'clearStatusHold', keys: ['Escape'], help: 'Esc clear', kind: 'escape' },
  { id: 'holdNudges', help: 'hold nudges', kind: 'note' },
  { id: 'shiftCoarse', help: 'Shift coarse', kind: 'note' },
  { id: 'altCoarser', help: 'Alt coarser', kind: 'note' },
];

/**
 * Join catalog help bits into the shared Extreme hotkey legend.
 * @param {typeof DISNEY_EXTREME_HOTKEY_CATALOG} [catalog]
 * @returns {string}
 */
export function formatDisneyExtremeHotkeyCatalog(
  catalog = DISNEY_EXTREME_HOTKEY_CATALOG,
) {
  return catalog.map((e) => e.help).join(' · ');
}

/** Shared Face Live Extreme hotkey legend (status / docs). */
export const DISNEY_EXTREME_HOTKEY_HELP = formatDisneyExtremeHotkeyCatalog();

/**
 * Match a key against the Extreme hotkey catalog.
 * @param {string} key
 * @returns {{ entry: object, dir: number }|null}
 */
export function matchDisneyExtremeHotkey(key) {
  const k = String(key || '');
  for (const entry of DISNEY_EXTREME_HOTKEY_CATALOG) {
    if (entry.kind === 'note') continue;
    if (entry.kind === 'nudge') {
      if (entry.keys.down.includes(k)) return { entry, dir: -1 };
      if (entry.keys.up.includes(k)) return { entry, dir: 1 };
      continue;
    }
    if (Array.isArray(entry.keys) && entry.keys.includes(k)) {
      return { entry, dir: 0 };
    }
  }
  return null;
}

/**
 * True when `key` is an Extreme factor nudge key (Alt coarser allowed).
 * @param {string} key
 * @returns {boolean}
 */
export function isDisneyExtremeNudgeHotkeyKey(key) {
  const m = matchDisneyExtremeHotkey(key);
  return !!(m && m.entry.kind === 'nudge');
}

/**
 * Status prefix + hotkey legend for Extreme off/on idle copy.
 * @param {{ enabled?: boolean }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeHotkeyHelp(opts = {}) {
  return `${opts.enabled ? 'extreme on' : 'extreme off'} · ${DISNEY_EXTREME_HOTKEY_HELP}`;
}

/** How long Copy / Help / Reset flashes stick before live HUD resumes. */
export const DISNEY_EXTREME_STATUS_HOLD_MS = 2200;

/**
 * Whether Face Live should keep a flashed Extreme status instead of live HUD.
 * @param {number|null|undefined} holdUntilMs
 * @param {number} [nowMs]
 * @returns {boolean}
 */
export function shouldHoldDisneyExtremeStatus(holdUntilMs, nowMs = Date.now()) {
  return typeof holdUntilMs === 'number' && Number.isFinite(holdUntilMs) && holdUntilMs > nowMs;
}

/**
 * Classify a morph key as eye-ish or mouth-ish for Disney Extreme amplify.
 * @param {string} key
 * @returns {{ isEye: boolean, isMouth: boolean }}
 */
export function classifyDisneyExtremeMorphKey(key) {
  const k = String(key || '');
  const isEye =
    k.includes('eye') ||
    k.includes('iris') ||
    k.includes('pupil') ||
    k.includes('brow') ||
    k.includes('lid');
  const isMouth =
    k.includes('mouth') || k.includes('lip') || k.includes('jaw');
  return { isEye, isMouth };
}

/**
 * Amplify final morph targets for Disney Extreme (eye/brow vs mouth/lip/jaw).
 * Mutates and returns `targets`. Weights are capped at `weightCap` (default 2).
 * @param {Record<string, number>|null|undefined} targets
 * @param {{
 *   enabled?: boolean,
 *   eyeFactor?: number,
 *   mouthFactor?: number,
 *   weightCap?: number,
 * }} [opts]
 */
export function amplifyDisneyExtremeMorphs(targets, opts = {}) {
  if (!targets || typeof targets !== 'object') return targets || {};
  if (!opts.enabled) return targets;
  const eyeFactor =
    typeof opts.eyeFactor === 'number' && opts.eyeFactor > 0
      ? opts.eyeFactor
      : DISNEY_EXTREME_DEFAULTS.eyeFactor;
  const mouthFactor =
    typeof opts.mouthFactor === 'number' && opts.mouthFactor > 0
      ? opts.mouthFactor
      : DISNEY_EXTREME_DEFAULTS.mouthFactor;
  const weightCap =
    typeof opts.weightCap === 'number' && opts.weightCap > 0
      ? opts.weightCap
      : DISNEY_EXTREME_DEFAULTS.weightCap;

  for (const [k, v] of Object.entries(targets)) {
    if (typeof v !== 'number' || !(v > 0)) continue;
    const { isEye, isMouth } = classifyDisneyExtremeMorphKey(k);
    if (isEye) targets[k] = Math.min(weightCap, v * eyeFactor);
    if (isMouth) targets[k] = Math.min(weightCap, v * mouthFactor);
  }
  return targets;
}

/**
 * Format Face Live HUD / status copy for Disney Extreme effective intensities.
 * When enabled, always includes eased shape readout; optional `bodyMix` from Layer B.
 * X pill: `shape · e{ease}` (+ ` · m{mix}` when bodyMix provided).
 * @param {{
 *   enabled?: boolean,
 *   shapeInt?: number,
 *   bodyInt?: number,
 *   bodyOn?: boolean,
 *   eyeFactor?: number,
 *   mouthFactor?: number,
 *   ease?: number,
 *   bodyMix?: number,
 * }} [opts]
 * @returns {{ pill: string, status: string, ease: number, bodyMix?: number }}
 */
export function formatDisneyExtremeLiveHud(opts = {}) {
  if (!opts.enabled) {
    return {
      pill: 'off',
      status: formatDisneyExtremeHotkeyHelp({ enabled: false }),
      ease: 0,
    };
  }
  const shapeInt = Number(opts.shapeInt);
  const bodyInt = Number(opts.bodyInt);
  const eyeFactor =
    typeof opts.eyeFactor === 'number' && opts.eyeFactor > 0
      ? opts.eyeFactor
      : DISNEY_EXTREME_DEFAULTS.eyeFactor;
  const mouthFactor =
    typeof opts.mouthFactor === 'number' && opts.mouthFactor > 0
      ? opts.mouthFactor
      : DISNEY_EXTREME_DEFAULTS.mouthFactor;
  const s = Number.isFinite(shapeInt) ? shapeInt : 0;
  const b = Number.isFinite(bodyInt) ? bodyInt : 0;
  const ease =
    typeof opts.ease === 'number' && Number.isFinite(opts.ease)
      ? opts.ease
      : easeEmotionIntensity(s);
  const hasMix =
    typeof opts.bodyMix === 'number' && Number.isFinite(opts.bodyMix);
  const bodyBit = opts.bodyOn ? `body ${b.toFixed(2)}` : `body ${b.toFixed(2)} (off)`;
  const mixBit = hasMix ? ` · mix ${opts.bodyMix.toFixed(2)}` : '';
  const pill = hasMix
    ? `${s.toFixed(2)} · e${ease.toFixed(2)} · m${opts.bodyMix.toFixed(2)}`
    : `${s.toFixed(2)} · e${ease.toFixed(2)}`;
  /** @type {{ pill: string, status: string, ease: number, bodyMix?: number }} */
  const out = {
    pill,
    ease,
    status: `shape ${s.toFixed(2)} · ${bodyBit} · ease ${ease.toFixed(2)}${mixBit} · eye×${eyeFactor.toFixed(2)} · mouth×${mouthFactor.toFixed(2)}`,
  };
  if (hasMix) out.bodyMix = opts.bodyMix;
  return out;
}

/**
 * Compute effective Disney Extreme shape/body intensities from a base intensity.
 * @param {number} baseIntensity
 * @param {{
 *   enabled?: boolean,
 *   shapeFactor?: number,
 *   bodyOn?: boolean,
 *   bodyFactor?: number,
 *   intensityCap?: number,
 * }} [opts]
 * @returns {{
 *   enabled: boolean,
 *   shapeFactor: number,
 *   shapeInt: number,
 *   bodyOn: boolean,
 *   bodyFactor: number,
 *   bodyInt: number,
 *   intensityCap: number,
 * }}
 */
export function computeDisneyExtremeIntensities(baseIntensity, opts = {}) {
  const enabled = !!opts.enabled;
  const intensityCap =
    typeof opts.intensityCap === 'number' && opts.intensityCap > 0
      ? opts.intensityCap
      : DISNEY_EXTREME_DEFAULTS.intensityCap;
  const raw =
    typeof baseIntensity === 'number' && Number.isFinite(baseIntensity)
      ? Math.max(0, baseIntensity)
      : 0;
  const shapeFactorIn =
    typeof opts.shapeFactor === 'number' && opts.shapeFactor > 0
      ? opts.shapeFactor
      : DISNEY_EXTREME_DEFAULTS.shapeFactor;
  const bodyFactorIn =
    typeof opts.bodyFactor === 'number' && opts.bodyFactor > 0
      ? opts.bodyFactor
      : DISNEY_EXTREME_DEFAULTS.bodyFactor;
  const shapeFactor = enabled ? shapeFactorIn : 1;
  const bodyOn = enabled && !!opts.bodyOn;
  const bodyMul = bodyOn ? bodyFactorIn : 1;
  return {
    enabled,
    shapeFactor,
    shapeInt: Math.min(intensityCap, raw * shapeFactor),
    bodyOn,
    bodyFactor: bodyFactorIn,
    bodyInt: Math.min(intensityCap, raw * bodyMul),
    intensityCap,
  };
}
