/**
 * Map Amoji emotion ids → morph target weights for Sakura LO/HI GLBs.
 * HI uses hand-tuned intensity sculpt recipes (subtle/medium/peak, not linear scales).
 * LO crossfades baked EMO_*_{subtle,medium,peak} morphs.
 */
import sculptData from '../../data/emotions/intensity-sculpt-recipes.json' with { type: 'json' };
import { applyYouthfulSmileBias } from './smileLaugh.js';
import {
  disneyExtremeBodyMix,
  DISNEY_EXTREME_NECK_SCALE_BLEND,
} from './neckShoulder.js';

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
 * Extreme-band recipe weight scale for intensity t (1 at peak and below).
 * @param {number} t 0..2
 * @returns {number}
 */
export function disneyExtremeRecipeOverdriveScale(t) {
  const x = Math.max(0, Math.min(2, Number(t) || 0));
  if (x <= 1) return 1;
  return 1 + (x - 1) * DISNEY_EXTREME_RECIPE_OVERDRIVE_GAIN;
}

/**
 * Compact label for the Extreme ease curve readout.
 * When Extreme is on and markerT > 1, also shows recipe overdrive scale.
 * @param {{ markerT?: number, enabled?: boolean }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeEaseCurveLabel(opts = {}) {
  const gain = DISNEY_EXTREME_EASE_OVERDRIVE_GAIN;
  if (!opts.enabled) return `ease curve · od ×${gain.toFixed(2)} (off)`;
  if (typeof opts.markerT === 'number' && Number.isFinite(opts.markerT)) {
    const t = Math.max(0, Math.min(2, opts.markerT));
    const recipe = disneyExtremeRecipeOverdriveScale(t);
    const recipeBit =
      t > 1 + 1e-9 ? ` · recipe ×${recipe.toFixed(2)}` : '';
    return `ease ${easeEmotionIntensity(t).toFixed(2)} @ ${t.toFixed(2)} · od ×${gain.toFixed(2)}${recipeBit}`;
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

/** Per-factor slider ceilings for Extreme factor-bar UI. */
export const DISNEY_EXTREME_FACTOR_BAR_MAX = {
  shape: 1.8,
  body: 1.8,
  eye: 2.2,
  mouth: 2.2,
};

/**
 * @param {number} n
 * @param {number} min
 * @param {number} max
 */
function clampDisneyExtremeFactor(n, min, max) {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : min;
  return Math.max(min, Math.min(max, v));
}

/**
 * Normalize Extreme × factors for bars / labels.
 * @param {{
 *   shapeFactor?: number,
 *   bodyFactor?: number,
 *   eyeFactor?: number,
 *   mouthFactor?: number,
 *   bodyOn?: boolean,
 * }} [opts]
 * @returns {{
 *   shape: number,
 *   body: number,
 *   eye: number,
 *   mouth: number,
 *   bodyOn: boolean,
 * }}
 */
export function normalizeDisneyExtremeFactors(opts = {}) {
  const d = DISNEY_EXTREME_DEFAULTS;
  const max = DISNEY_EXTREME_FACTOR_BAR_MAX;
  return {
    shape: clampDisneyExtremeFactor(
      opts.shapeFactor ?? d.shapeFactor,
      1,
      max.shape,
    ),
    body: clampDisneyExtremeFactor(
      opts.bodyFactor ?? d.bodyFactor,
      1,
      max.body,
    ),
    eye: clampDisneyExtremeFactor(opts.eyeFactor ?? d.eyeFactor, 1, max.eye),
    mouth: clampDisneyExtremeFactor(
      opts.mouthFactor ?? d.mouthFactor,
      1,
      max.mouth,
    ),
    bodyOn: !!opts.bodyOn,
  };
}

/**
 * Compact label for Extreme shape/body/eye/mouth × factors.
 * @param {{
 *   enabled?: boolean,
 *   shapeFactor?: number,
 *   bodyFactor?: number,
 *   eyeFactor?: number,
 *   mouthFactor?: number,
 *   bodyOn?: boolean,
 * }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeFactorBarsLabel(opts = {}) {
  if (!opts.enabled) return 'factors · shape/body/eye/mouth (off)';
  const f = normalizeDisneyExtremeFactors(opts);
  const bodyBit = f.bodyOn
    ? `body×${f.body.toFixed(2)}`
    : 'body off';
  return `shape×${f.shape.toFixed(2)} · ${bodyBit} · eye×${f.eye.toFixed(2)} · mouth×${f.mouth.toFixed(2)}`;
}

/**
 * Horizontal factor bars SVG (shape / body / eye / mouth).
 * @param {{
 *   enabled?: boolean,
 *   shapeFactor?: number,
 *   bodyFactor?: number,
 *   eyeFactor?: number,
 *   mouthFactor?: number,
 *   bodyOn?: boolean,
 *   width?: number,
 *   height?: number,
 * }} [opts]
 * @returns {{ svg: string, empty: boolean, factors: ReturnType<typeof normalizeDisneyExtremeFactors> }}
 */
export function buildDisneyExtremeFactorBarsSvg(opts = {}) {
  const width = opts.width ?? 160;
  const height = opts.height ?? 44;
  const factors = normalizeDisneyExtremeFactors(opts);
  const max = DISNEY_EXTREME_FACTOR_BAR_MAX;
  const padX = 28;
  const padY = 3;
  const rowH = (height - padY * 2) / 4;
  const barMaxW = width - padX - 4;
  const rows = [
    {
      id: 'shape',
      label: 'S',
      value: factors.shape,
      max: max.shape,
      fill: '#7ec8ff',
    },
    {
      id: 'body',
      label: 'B',
      value: opts.enabled && factors.bodyOn ? factors.body : 1,
      max: max.body,
      fill: opts.enabled && factors.bodyOn ? '#9ddea6' : 'rgba(157,222,166,0.35)',
    },
    {
      id: 'eye',
      label: 'E',
      value: factors.eye,
      max: max.eye,
      fill: '#c4a1ff',
    },
    {
      id: 'mouth',
      label: 'M',
      value: factors.mouth,
      max: max.mouth,
      fill: '#ffb454',
    },
  ];
  const muted = !opts.enabled;
  const parts = rows.map((row, i) => {
    const y = padY + i * rowH + rowH * 0.2;
    const h = rowH * 0.6;
    const t = Math.max(0, Math.min(1, (row.value - 1) / Math.max(1e-6, row.max - 1)));
    const w = muted ? barMaxW * 0.08 : barMaxW * t;
    const fill = muted ? 'rgba(255,255,255,0.18)' : row.fill;
    return `<text x="2" y="${(y + h * 0.85).toFixed(1)}" fill="rgba(255,255,255,0.55)" font-size="8" font-family="ui-monospace,monospace">${row.label}</text><rect x="${padX}" y="${y.toFixed(1)}" width="${barMaxW.toFixed(1)}" height="${h.toFixed(1)}" rx="1.5" fill="rgba(255,255,255,0.06)"/><rect x="${padX}" y="${y.toFixed(1)}" width="${Math.max(1.5, w).toFixed(1)}" height="${h.toFixed(1)}" rx="1.5" fill="${fill}"/>`;
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Disney Extreme factor bars"><rect width="100%" height="100%" fill="transparent"/>${parts.join('')}</svg>`;
  return { svg, empty: false, factors };
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
  { id: 'copyEaseCurve', help: 'Shift+E copy ease', kind: 'note' },
  { id: 'showBodyMix', keys: ['m', 'M'], help: 'M mix', kind: 'action' },
  { id: 'copyBodyMixCurve', help: 'Shift+M copy mix', kind: 'note' },
  { id: 'showFactorBars', keys: ['f', 'F'], help: 'F factors', kind: 'action' },
  { id: 'copyFactorBars', help: 'Shift+F copy factors', kind: 'note' },
  { id: 'showNeckBlend', keys: ['n', 'N'], help: 'N neck', kind: 'action' },
  { id: 'showBundle', keys: ['a', 'A'], help: 'A all', kind: 'action' },
  { id: 'copyBundle', help: 'Shift+A copy all', kind: 'note' },
  { id: 'copySnapshotJson', keys: ['j', 'J'], help: 'J json', kind: 'action' },
  { id: 'pasteSnapshotJson', help: 'Shift+J paste json', kind: 'note' },
  { id: 'showSnapshotDiff', keys: ['d', 'D'], help: 'D diff', kind: 'action' },
  { id: 'restoreBaseline', help: 'Shift+D restore', kind: 'note' },
  { id: 'clearBaseline', keys: ['k', 'K'], help: 'K clear base', kind: 'action' },
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
 * Status adds recipe × above peak and optional neck blend when body is on.
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
 *   neckBlend?: number,
 * }} [opts]
 * @returns {{
 *   pill: string,
 *   status: string,
 *   ease: number,
 *   recipe: number,
 *   bodyMix?: number,
 *   neckBlend?: number,
 * }}
 */
export function formatDisneyExtremeLiveHud(opts = {}) {
  if (!opts.enabled) {
    return {
      pill: 'off',
      status: formatDisneyExtremeHotkeyHelp({ enabled: false }),
      ease: 0,
      recipe: 1,
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
  const recipe = disneyExtremeRecipeOverdriveScale(s);
  const hasMix =
    typeof opts.bodyMix === 'number' && Number.isFinite(opts.bodyMix);
  const hasNeck =
    !!opts.bodyOn &&
    typeof opts.neckBlend === 'number' &&
    Number.isFinite(opts.neckBlend);
  const bodyBit = opts.bodyOn ? `body ${b.toFixed(2)}` : `body ${b.toFixed(2)} (off)`;
  const mixBit = hasMix ? ` · mix ${opts.bodyMix.toFixed(2)}` : '';
  const recipeBit = s > 1 + 1e-9 ? ` · recipe ×${recipe.toFixed(2)}` : '';
  const neckBit = hasNeck ? ` · neck ${opts.neckBlend.toFixed(2)}` : '';
  const pill = hasMix
    ? `${s.toFixed(2)} · e${ease.toFixed(2)} · m${opts.bodyMix.toFixed(2)}`
    : `${s.toFixed(2)} · e${ease.toFixed(2)}`;
  /** @type {{ pill: string, status: string, ease: number, recipe: number, bodyMix?: number, neckBlend?: number }} */
  const out = {
    pill,
    ease,
    recipe,
    status: `shape ${s.toFixed(2)} · ${bodyBit} · ease ${ease.toFixed(2)}${mixBit}${recipeBit}${neckBit} · eye×${eyeFactor.toFixed(2)} · mouth×${mouthFactor.toFixed(2)}`,
  };
  if (hasMix) out.bodyMix = opts.bodyMix;
  if (hasNeck) out.neckBlend = opts.neckBlend;
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

/**
 * Unified Extreme live snapshot (ints + ease/recipe/mix/neck + factors).
 * @param {{
 *   enabled?: boolean,
 *   intensity?: number,
 *   shapeFactor?: number,
 *   bodyFactor?: number,
 *   eyeFactor?: number,
 *   mouthFactor?: number,
 *   bodyOn?: boolean,
 * }} [opts]
 * @returns {{
 *   enabled: boolean,
 *   intensity: number,
 *   shapeFactor: number,
 *   bodyFactor: number,
 *   eyeFactor: number,
 *   mouthFactor: number,
 *   bodyOn: boolean,
 *   shapeInt: number,
 *   bodyInt: number,
 *   ease: number,
 *   recipe: number,
 *   bodyMix: number,
 *   neckBlend: number,
 * }}
 */
export function buildDisneyExtremeLiveSnapshot(opts = {}) {
  const enabled = !!opts.enabled;
  const intensity =
    typeof opts.intensity === 'number' && Number.isFinite(opts.intensity)
      ? Math.max(0, opts.intensity)
      : 0;
  const factors = normalizeDisneyExtremeFactors({
    shapeFactor: opts.shapeFactor,
    bodyFactor: opts.bodyFactor,
    eyeFactor: opts.eyeFactor,
    mouthFactor: opts.mouthFactor,
    bodyOn: opts.bodyOn,
  });
  const ints = computeDisneyExtremeIntensities(intensity, {
    enabled,
    shapeFactor: factors.shape,
    bodyOn: factors.bodyOn,
    bodyFactor: factors.body,
  });
  return {
    enabled,
    intensity,
    shapeFactor: factors.shape,
    bodyFactor: factors.body,
    eyeFactor: factors.eye,
    mouthFactor: factors.mouth,
    bodyOn: ints.bodyOn,
    shapeInt: ints.shapeInt,
    bodyInt: ints.bodyInt,
    ease: easeEmotionIntensity(ints.shapeInt),
    recipe: disneyExtremeRecipeOverdriveScale(ints.shapeInt),
    bodyMix: disneyExtremeBodyMix(ints.bodyInt),
    neckBlend: DISNEY_EXTREME_NECK_SCALE_BLEND,
  };
}

/**
 * One-line Extreme bundle readout (A hotkey / combined flash).
 * Accepts a snapshot or the same opts as `buildDisneyExtremeLiveSnapshot`.
 * @param {object} [snapOrOpts]
 * @returns {string}
 */
export function formatDisneyExtremeBundleLabel(snapOrOpts = {}) {
  const snap =
    snapOrOpts &&
    typeof snapOrOpts === 'object' &&
    typeof snapOrOpts.shapeInt === 'number' &&
    typeof snapOrOpts.ease === 'number'
      ? snapOrOpts
      : buildDisneyExtremeLiveSnapshot(snapOrOpts);
  if (!snap.enabled) {
    return 'extreme off · A all · E ease · M mix · F factors · N neck';
  }
  const recipeBit =
    snap.shapeInt > 1 + 1e-9
      ? ` · recipe ×${Number(snap.recipe).toFixed(2)}`
      : '';
  const mixBit = snap.bodyOn
    ? ` · mix ${Number(snap.bodyMix).toFixed(2)} · neck ${Number(snap.neckBlend).toFixed(2)}`
    : ' · body off';
  return `shape ${Number(snap.shapeInt).toFixed(2)} · ease ${Number(snap.ease).toFixed(2)}${recipeBit}${mixBit} · eye×${Number(snap.eyeFactor).toFixed(2)} · mouth×${Number(snap.mouthFactor).toFixed(2)}`;
}

/**
 * Map a live Extreme snapshot into `formatDisneyExtremeLiveHud` output.
 * @param {ReturnType<typeof buildDisneyExtremeLiveSnapshot>|null|undefined} snap
 * @returns {ReturnType<typeof formatDisneyExtremeLiveHud>}
 */
export function formatDisneyExtremeLiveHudFromSnapshot(snap) {
  if (!snap || !snap.enabled) {
    return formatDisneyExtremeLiveHud({ enabled: false });
  }
  return formatDisneyExtremeLiveHud({
    enabled: true,
    shapeInt: snap.shapeInt,
    bodyInt: snap.bodyInt,
    bodyOn: snap.bodyOn,
    bodyMix: snap.bodyMix,
    neckBlend: snap.bodyOn ? snap.neckBlend : undefined,
    eyeFactor: snap.eyeFactor,
    mouthFactor: snap.mouthFactor,
    ease: snap.ease,
  });
}

/**
 * Stable fingerprint for Extreme snapshot-driven SVG rebuilds.
 * @param {ReturnType<typeof buildDisneyExtremeLiveSnapshot>|null|undefined} snap
 * @returns {string}
 */
export function disneyExtremeSnapshotFingerprint(snap) {
  if (!snap || !snap.enabled) return 'off';
  return [
    snap.bodyOn ? 1 : 0,
    Number(snap.shapeInt).toFixed(3),
    Number(snap.bodyInt).toFixed(3),
    Number(snap.shapeFactor).toFixed(2),
    Number(snap.bodyFactor).toFixed(2),
    Number(snap.eyeFactor).toFixed(2),
    Number(snap.mouthFactor).toFixed(2),
    Number(snap.ease).toFixed(3),
    Number(snap.recipe).toFixed(3),
    Number(snap.bodyMix).toFixed(3),
  ].join('|');
}

export const DISNEY_EXTREME_SNAPSHOT_JSON_KIND =
  'amoji.disneyExtreme.snapshot.v1';

/**
 * Serialize an Extreme snapshot to JSON (clipboard / export).
 * @param {ReturnType<typeof buildDisneyExtremeLiveSnapshot>|object} [snapOrOpts]
 * @param {{ pretty?: boolean }} [opts]
 * @returns {string}
 */
export function serializeDisneyExtremeSnapshot(snapOrOpts = {}, opts = {}) {
  const snap =
    snapOrOpts &&
    typeof snapOrOpts === 'object' &&
    typeof snapOrOpts.shapeInt === 'number' &&
    typeof snapOrOpts.ease === 'number'
      ? snapOrOpts
      : buildDisneyExtremeLiveSnapshot(snapOrOpts);
  const payload = {
    kind: DISNEY_EXTREME_SNAPSHOT_JSON_KIND,
    enabled: !!snap.enabled,
    intensity: Number(snap.intensity) || 0,
    shapeFactor: Number(snap.shapeFactor),
    bodyFactor: Number(snap.bodyFactor),
    eyeFactor: Number(snap.eyeFactor),
    mouthFactor: Number(snap.mouthFactor),
    bodyOn: !!snap.bodyOn,
    shapeInt: Number(snap.shapeInt),
    bodyInt: Number(snap.bodyInt),
    ease: Number(snap.ease),
    recipe: Number(snap.recipe),
    bodyMix: Number(snap.bodyMix),
    neckBlend: Number(snap.neckBlend),
  };
  return JSON.stringify(payload, null, opts.pretty ? 2 : 0);
}

/**
 * Parse clipboard / export JSON into a live Extreme snapshot.
 * @param {string|object|null|undefined} input
 * @returns {{ ok: true, snap: ReturnType<typeof buildDisneyExtremeLiveSnapshot> }|{ ok: false, error: string }}
 */
export function parseDisneyExtremeSnapshot(input) {
  let obj = input;
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return { ok: false, error: 'empty' };
    try {
      obj = JSON.parse(trimmed);
    } catch {
      return { ok: false, error: 'invalid_json' };
    }
  }
  if (!obj || typeof obj !== 'object') {
    return { ok: false, error: 'invalid_payload' };
  }
  if (obj.kind !== DISNEY_EXTREME_SNAPSHOT_JSON_KIND) {
    return { ok: false, error: 'kind' };
  }
  const snap = buildDisneyExtremeLiveSnapshot({
    enabled: !!obj.enabled,
    intensity: Number(obj.intensity) || 0,
    shapeFactor: Number(obj.shapeFactor),
    bodyFactor: Number(obj.bodyFactor),
    eyeFactor: Number(obj.eyeFactor),
    mouthFactor: Number(obj.mouthFactor),
    bodyOn: !!obj.bodyOn,
  });
  return { ok: true, snap };
}

/**
 * Compact fingerprint token for status flashes (stable for equal snaps).
 * @param {ReturnType<typeof buildDisneyExtremeLiveSnapshot>|null|undefined} snap
 * @param {{ length?: number }} [opts]
 * @returns {string}
 */
export function disneyExtremeSnapshotFingerprintShort(snap, opts = {}) {
  const fp = disneyExtremeSnapshotFingerprint(snap);
  if (fp === 'off') return 'off';
  const length = Math.max(4, Math.min(16, Number(opts.length) || 8));
  let h = 2166136261;
  for (let i = 0; i < fp.length; i++) {
    h ^= fp.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const hex = (h >>> 0).toString(16).padStart(8, '0');
  return hex.slice(0, length);
}

const DISNEY_EXTREME_SNAPSHOT_DIFF_FIELDS = [
  'enabled',
  'bodyOn',
  'shapeFactor',
  'bodyFactor',
  'eyeFactor',
  'mouthFactor',
  'intensity',
];

/**
 * Field-level diff between two Extreme snapshots (or opts).
 * @param {object|null|undefined} a
 * @param {object|null|undefined} b
 * @returns {{ equal: boolean, changes: string[] }}
 */
export function diffDisneyExtremeSnapshots(a, b) {
  const left = a && typeof a === 'object' && typeof a.shapeInt === 'number'
    ? a
    : buildDisneyExtremeLiveSnapshot(a || { enabled: false });
  const right = b && typeof b === 'object' && typeof b.shapeInt === 'number'
    ? b
    : buildDisneyExtremeLiveSnapshot(b || { enabled: false });
  const changes = [];
  for (const key of DISNEY_EXTREME_SNAPSHOT_DIFF_FIELDS) {
    const lv = left[key];
    const rv = right[key];
    if (typeof lv === 'boolean' || typeof rv === 'boolean') {
      if (!!lv !== !!rv) changes.push(key);
      continue;
    }
    if (Math.abs(Number(lv) - Number(rv)) > 1e-6) changes.push(key);
  }
  return { equal: changes.length === 0, changes };
}

/**
 * One-line label for an Extreme snapshot diff.
 * @param {{ equal?: boolean, changes?: string[] }|null|undefined} diff
 * @returns {string}
 */
export function formatDisneyExtremeSnapshotDiffLabel(diff) {
  if (!diff || diff.equal || !diff.changes?.length) {
    return 'diff · match';
  }
  return `diff · ${diff.changes.join(' · ')}`;
}

/**
 * Whether current Extreme snap differs from a baseline snap.
 * @param {object|null|undefined} current
 * @param {object|null|undefined} baseline
 * @returns {boolean}
 */
export function isDisneyExtremeSnapshotDirty(current, baseline) {
  if (!baseline) return false;
  return !diffDisneyExtremeSnapshots(current, baseline).equal;
}

/**
 * Compact dirty/clean bit for Extreme HUD pill / status.
 * Optional `fp` appends the short baseline fingerprint.
 * @param {{ hasBaseline?: boolean, dirty?: boolean, fp?: string }} [opts]
 * @returns {{ bit: string, dirty: boolean, hasBaseline: boolean, fp: string }}
 */
export function formatDisneyExtremeDirtyHudBit(opts = {}) {
  const hasBaseline = !!opts.hasBaseline;
  const dirty = hasBaseline && !!opts.dirty;
  const fp =
    hasBaseline && typeof opts.fp === 'string' && opts.fp
      ? String(opts.fp)
      : '';
  const fpBit = fp ? ` ${fp}` : '';
  return {
    hasBaseline,
    dirty,
    fp,
    bit: !hasBaseline ? '' : dirty ? ` · dirty${fpBit}` : ` · clean${fpBit}`,
  };
}

/**
 * Clone an Extreme snapshot into a stable baseline object.
 * @param {ReturnType<typeof buildDisneyExtremeLiveSnapshot>|object|null|undefined} snapOrOpts
 * @returns {ReturnType<typeof buildDisneyExtremeLiveSnapshot>|null}
 */
export function captureDisneyExtremeBaseline(snapOrOpts) {
  if (!snapOrOpts || typeof snapOrOpts !== 'object') return null;
  const snap =
    typeof snapOrOpts.shapeInt === 'number' &&
    typeof snapOrOpts.ease === 'number'
      ? snapOrOpts
      : buildDisneyExtremeLiveSnapshot(snapOrOpts);
  return buildDisneyExtremeLiveSnapshot({
    enabled: !!snap.enabled,
    intensity: Number(snap.intensity) || 0,
    shapeFactor: Number(snap.shapeFactor),
    bodyFactor: Number(snap.bodyFactor),
    eyeFactor: Number(snap.eyeFactor),
    mouthFactor: Number(snap.mouthFactor),
    bodyOn: !!snap.bodyOn,
  });
}

/**
 * Tooltip / status summary for Extreme baseline dirty tracking.
 * @param {{ hasBaseline?: boolean, dirty?: boolean, fp?: string }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeBaselineSummary(opts = {}) {
  if (!opts.hasBaseline) {
    return 'baseline · none · D diff · ⇧D restore · K clear';
  }
  const state = opts.dirty ? 'dirty' : 'clean';
  const fp =
    typeof opts.fp === 'string' && opts.fp ? ` · fp ${opts.fp}` : '';
  return `baseline · ${state}${fp} · D diff · ⇧D restore · K clear`;
}

export const DISNEY_EXTREME_BASELINE_STORAGE_KEY =
  'amoji.disneyExtreme.baseline.v1';

function resolveDisneyExtremeBaselineStorage(opts = {}) {
  if (opts.storage) return opts.storage;
  if (opts.memory) return null;
  if (typeof sessionStorage !== 'undefined') return sessionStorage;
  return null;
}

/**
 * Persist an Extreme baseline snapshot (sessionStorage by default).
 * @param {object|null|undefined} snap
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 * @returns {{ ok: boolean, snap: ReturnType<typeof captureDisneyExtremeBaseline> }}
 */
export function saveDisneyExtremeBaseline(snap, opts = {}) {
  const captured = captureDisneyExtremeBaseline(snap);
  const storage = resolveDisneyExtremeBaselineStorage(opts);
  if (!captured) {
    if (storage) {
      try {
        storage.removeItem(DISNEY_EXTREME_BASELINE_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
    return { ok: false, snap: null };
  }
  if (storage) {
    try {
      storage.setItem(
        DISNEY_EXTREME_BASELINE_STORAGE_KEY,
        serializeDisneyExtremeSnapshot(captured),
      );
    } catch {
      /* ignore quota */
    }
  }
  return { ok: true, snap: captured };
}

/**
 * Load Extreme baseline from sessionStorage (or injected storage).
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 * @returns {ReturnType<typeof buildDisneyExtremeLiveSnapshot>|null}
 */
export function loadDisneyExtremeBaseline(opts = {}) {
  const storage = resolveDisneyExtremeBaselineStorage(opts);
  if (!storage) return null;
  try {
    const raw = storage.getItem(DISNEY_EXTREME_BASELINE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = parseDisneyExtremeSnapshot(raw);
    return parsed.ok ? parsed.snap : null;
  } catch {
    return null;
  }
}

/**
 * Clear persisted Extreme baseline.
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 * @returns {{ ok: boolean }}
 */
export function clearDisneyExtremeBaselineStorage(opts = {}) {
  const storage = resolveDisneyExtremeBaselineStorage(opts);
  if (storage) {
    try {
      storage.removeItem(DISNEY_EXTREME_BASELINE_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return { ok: true };
}
