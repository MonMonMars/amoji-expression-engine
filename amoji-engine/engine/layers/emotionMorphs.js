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
  { id: 'copySnapshotDiff', help: 'Shift+C copy diff', kind: 'note' },
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
  { id: 'clearBaselineHistory', help: 'Shift+K clear hist', kind: 'note' },
  { id: 'clearBaselineRedo', keys: ['w', 'W'], help: 'W wipe redo', kind: 'action' },
  { id: 'clearBaselineFavorites', help: 'Shift+W wipe favs', kind: 'note' },
  { id: 'pinBaseline', keys: ['p', 'P'], help: 'P pin base', kind: 'action' },
  { id: 'copyBaselineRedoJson', keys: ['o', 'O'], help: 'O copy redo JSON', kind: 'action' },
  { id: 'pasteBaselineRedoJson', help: 'Shift+O paste redo', kind: 'note' },
  { id: 'mergeBaselineRedoJson', help: 'Alt+O merge redo', kind: 'note' },
  { id: 'undoBaseline', keys: ['u', 'U'], help: 'U undo base', kind: 'action' },
  { id: 'redoBaseline', help: 'Shift+U redo base', kind: 'note' },
  { id: 'copySnapshotShareUrl', keys: ['y', 'Y'], help: 'Y share link', kind: 'action' },
  { id: 'copyBaselineHistoryShareUrl', help: 'Shift+Y share hist', kind: 'note' },
  { id: 'copyBaselineRedoShareUrl', help: 'Alt+Y share redo', kind: 'note' },
  { id: 'starBaselineFavorite', keys: ['s', 'S'], help: 'S star fav', kind: 'action' },
  { id: 'showBaselineFavorites', help: 'Shift+S fav list', kind: 'note' },
  { id: 'copyBaselineFavoritesJson', keys: ['g', 'G'], help: 'G copy fav JSON', kind: 'action' },
  { id: 'pasteBaselineFavoritesJson', help: 'Shift+G paste fav', kind: 'note' },
  { id: 'mergeBaselineFavoritesJson', help: 'Alt+G merge fav', kind: 'note' },
  { id: 'copyBaselineFavoritesShareUrl', keys: ['t', 'T'], help: 'T share fav', kind: 'action' },
  { id: 'showBaselineHistory', keys: ['l', 'L'], help: 'L hist list', kind: 'action' },
  { id: 'copyBaselineHistoryJson', help: 'Shift+L copy hist JSON', kind: 'note' },
  { id: 'pasteBaselineHistoryJson', keys: ['i', 'I'], help: 'I paste hist', kind: 'action' },
  { id: 'mergeBaselineHistoryJson', help: 'Shift+I merge hist', kind: 'note' },
  {
    id: 'jumpBaselineHistory',
    keys: ['1', '2', '3', '4', '5', '6', '7', '8'],
    help: '1–8 hist jump',
    kind: 'jump',
  },
  { id: 'jumpBaselineRedo', help: 'Shift+1–8 redo jump', kind: 'note' },
  { id: 'previewBaselineChip', help: 'Meta+click chip preview', kind: 'note' },
  { id: 'diffBaselineChip', help: 'Alt+click chip diff', kind: 'note' },
  { id: 'compareBaselineChips', help: 'Shift+Alt+click chip compare', kind: 'note' },
  { id: 'starBaselineChip', help: 'Shift+click chip star', kind: 'note' },
  { id: 'pinBaselineChip', help: 'dbl-click chip pin', kind: 'note' },
  { id: 'copyBaselineStacksJson', keys: ['z', 'Z'], help: 'Z copy stacks', kind: 'action' },
  { id: 'pasteBaselineStacksJson', help: 'Shift+Z paste stacks', kind: 'note' },
  { id: 'mergeBaselineStacksJson', help: 'Alt+Z merge stacks', kind: 'note' },
  { id: 'copyBaselineStacksShareUrl', keys: ['v', 'V'], help: 'V share stacks', kind: 'action' },
  { id: 'cycleBaselineFavoriteNext', keys: ['q', 'Q'], help: 'Q next fav', kind: 'action' },
  { id: 'cycleBaselineFavoritePrev', help: 'Shift+Q prev fav', kind: 'note' },
  { id: 'dropSnapshotJson', help: 'drop JSON · hist/redo/fav/stacks/snap · Meta preview · Shift merge · dbl-click paste', kind: 'note' },
  { id: 'clearStatusHold', keys: ['Escape'], help: 'Esc clear', kind: 'escape' },
  { id: 'holdNudges', help: 'hold nudges', kind: 'note' },
  { id: 'shiftCoarse', help: 'Shift coarse', kind: 'note' },
  { id: 'altCoarser', help: 'Alt coarser', kind: 'note' },
];

/**
 * Whether Extreme hist/redo stacks have anything to clear.
 * @param {{ historyDepth?: number, redoDepth?: number, history?: object[], redo?: object[] }} [opts]
 * @returns {boolean}
 */
export function hasDisneyExtremeBaselineHistory(opts = {}) {
  const histLen = Array.isArray(opts.history)
    ? opts.history.length
    : Math.max(0, Math.floor(Number(opts.historyDepth) || 0));
  const redoLen = Array.isArray(opts.redo)
    ? opts.redo.length
    : Math.max(0, Math.floor(Number(opts.redoDepth) || 0));
  return histLen + redoLen > 0;
}

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
 * Map digit key `1`–`8` → 0-based Extreme history index (or null).
 * @param {string} key
 * @param {{ limit?: number }} [opts]
 * @returns {number|null}
 */
export function disneyExtremeHistoryJumpIndex(key, opts = {}) {
  const limit = Math.max(
    1,
    Math.floor(Number(opts.limit) || DISNEY_EXTREME_BASELINE_HISTORY_LIMIT),
  );
  const n = Number(String(key || ''));
  if (!Number.isInteger(n) || n < 1 || n > limit) return null;
  return n - 1;
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
 * Optional `opts.baseline` appends clean/dirty×N + short fp (same bit as HUD).
 * @param {object} [snapOrOpts]
 * @param {{ baseline?: object|null }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeBundleLabel(snapOrOpts = {}, opts = {}) {
  const snap =
    snapOrOpts &&
    typeof snapOrOpts === 'object' &&
    typeof snapOrOpts.shapeInt === 'number' &&
    typeof snapOrOpts.ease === 'number'
      ? snapOrOpts
      : buildDisneyExtremeLiveSnapshot(snapOrOpts);
  let label;
  if (!snap.enabled) {
    label = 'extreme off · A all · E ease · M mix · F factors · N neck';
  } else {
    const recipeBit =
      snap.shapeInt > 1 + 1e-9
        ? ` · recipe ×${Number(snap.recipe).toFixed(2)}`
        : '';
    const mixBit = snap.bodyOn
      ? ` · mix ${Number(snap.bodyMix).toFixed(2)} · neck ${Number(snap.neckBlend).toFixed(2)}`
      : ' · body off';
    label = `shape ${Number(snap.shapeInt).toFixed(2)} · ease ${Number(snap.ease).toFixed(2)}${recipeBit}${mixBit} · eye×${Number(snap.eyeFactor).toFixed(2)} · mouth×${Number(snap.mouthFactor).toFixed(2)}`;
  }
  if (!opts.baseline) return label;
  const diff = diffDisneyExtremeSnapshots(snap, opts.baseline);
  const dirtyHud = formatDisneyExtremeDirtyHudBit({
    hasBaseline: true,
    dirty: !diff.equal,
    changeCount: diff.changes.length,
    fp: disneyExtremeSnapshotFingerprintShort(opts.baseline),
  });
  return `${label}${dirtyHud.bit}`;
}

/**
 * Whether Extreme should auto-capture a dirty-tracking baseline.
 * True when Extreme is on and no baseline is set yet.
 * @param {{ enabled?: boolean, hasBaseline?: boolean, baseline?: object|null }} [opts]
 * @returns {boolean}
 */
export function shouldAutoCaptureDisneyExtremeBaseline(opts = {}) {
  if (!opts.enabled) return false;
  if (opts.hasBaseline) return false;
  if (opts.baseline) return false;
  return true;
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

export const DISNEY_EXTREME_SNAPSHOT_HASH_PARAM = 'dxs';
export const DISNEY_EXTREME_HISTORY_HASH_PARAM = 'dxh';
export const DISNEY_EXTREME_REDO_HASH_PARAM = 'dxr';
export const DISNEY_EXTREME_FAVORITES_HASH_PARAM = 'dxf';
export const DISNEY_EXTREME_STACKS_HASH_PARAM = 'dxb';

function encodeDisneyExtremeBase64Url(json) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(json, 'utf8').toString('base64url');
  }
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function decodeDisneyExtremeBase64Url(raw) {
  const pad = raw.length % 4 === 0 ? '' : '='.repeat(4 - (raw.length % 4));
  const b64 = raw.replace(/-/g, '+').replace(/_/g, '/') + pad;
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(b64, 'base64').toString('utf8');
  }
  return decodeURIComponent(escape(atob(b64)));
}

/**
 * Encode Extreme snapshot → URL hash fragment (`#dxs=...` base64url JSON).
 * @param {ReturnType<typeof buildDisneyExtremeLiveSnapshot>|object} [snapOrOpts]
 * @returns {string}
 */
export function encodeDisneyExtremeSnapshotHash(snapOrOpts = {}) {
  const json = serializeDisneyExtremeSnapshot(snapOrOpts);
  return `${DISNEY_EXTREME_SNAPSHOT_HASH_PARAM}=${encodeDisneyExtremeBase64Url(json)}`;
}

/**
 * Decode `#dxs=...` or raw dxs= payload → Extreme snapshot.
 * @param {string} hashOrQuery
 * @returns {{ ok: true, snap: object }|{ ok: false, error: string }}
 */
export function decodeDisneyExtremeSnapshotHash(hashOrQuery) {
  if (!hashOrQuery || typeof hashOrQuery !== 'string') {
    return { ok: false, error: 'empty' };
  }
  let raw = hashOrQuery.replace(/^#/, '');
  const m = raw.match(
    new RegExp(`(?:^|&)?${DISNEY_EXTREME_SNAPSHOT_HASH_PARAM}=([^&]+)`),
  );
  if (!m) return { ok: false, error: 'no_dxs' };
  try {
    const json = decodeDisneyExtremeBase64Url(m[1]);
    return parseDisneyExtremeSnapshot(json);
  } catch {
    return { ok: false, error: 'decode_failed' };
  }
}

/**
 * Read Extreme snapshot from location.hash if `dxs=` is present.
 * @param {{ hash?: string }} [loc]
 * @returns {{ ok: true, snap: object }|{ ok: false, error: string }}
 */
export function loadDisneyExtremeSnapshotFromHash(loc = {}) {
  const hash =
    loc.hash ||
    (typeof location !== 'undefined' ? location.hash : '') ||
    '';
  if (!hash.includes(`${DISNEY_EXTREME_SNAPSHOT_HASH_PARAM}=`)) {
    return { ok: false, error: 'no_dxs' };
  }
  return decodeDisneyExtremeSnapshotHash(hash);
}

/**
 * Build share URL with Extreme snapshot in hash (`dxs=`).
 * Merges with existing hash params by default (replaces prior dxs=).
 * @param {ReturnType<typeof buildDisneyExtremeLiveSnapshot>|object} [snapOrOpts]
 * @param {{ baseUrl?: string, hash?: string, mergeHash?: boolean }} [opts]
 * @returns {{ ok: boolean, url: string, hash: string }}
 */
export function buildDisneyExtremeSnapshotShareUrl(snapOrOpts = {}, opts = {}) {
  const frag = encodeDisneyExtremeSnapshotHash(snapOrOpts);
  let hash = frag;
  if (opts.mergeHash !== false) {
    const existing = String(
      opts.hash ||
        (typeof location !== 'undefined' ? location.hash : '') ||
        '',
    ).replace(/^#/, '');
    if (existing) {
      const parts = existing
        .split('&')
        .filter(
          (p) =>
            p &&
            !p.startsWith(`${DISNEY_EXTREME_SNAPSHOT_HASH_PARAM}=`),
        );
      parts.push(frag);
      hash = parts.join('&');
    }
  }
  const base =
    opts.baseUrl ||
    (typeof location !== 'undefined'
      ? `${location.origin}${location.pathname}${location.search}`
      : '');
  return {
    ok: true,
    url: base ? `${base}#${hash}` : `#${hash}`,
    hash,
  };
}

/**
 * Encode Extreme baseline history → URL hash fragment (`#dxh=...` base64url JSON).
 * @param {object[]|{ history?: object[] }|null|undefined} [historyOrOpts]
 * @returns {string}
 */
export function encodeDisneyExtremeBaselineHistoryHash(historyOrOpts = {}) {
  const history = Array.isArray(historyOrOpts)
    ? historyOrOpts
    : Array.isArray(historyOrOpts?.history)
      ? historyOrOpts.history
      : [];
  const json = serializeDisneyExtremeBaselineHistory(history);
  return `${DISNEY_EXTREME_HISTORY_HASH_PARAM}=${encodeDisneyExtremeBase64Url(json)}`;
}

/**
 * Decode `#dxh=...` or raw dxh= payload → Extreme baseline history stack.
 * @param {string} hashOrQuery
 * @returns {{ ok: true, history: object[] }|{ ok: false, error: string }}
 */
export function decodeDisneyExtremeBaselineHistoryHash(hashOrQuery) {
  if (!hashOrQuery || typeof hashOrQuery !== 'string') {
    return { ok: false, error: 'empty' };
  }
  let raw = hashOrQuery.replace(/^#/, '');
  const m = raw.match(
    new RegExp(`(?:^|&)?${DISNEY_EXTREME_HISTORY_HASH_PARAM}=([^&]+)`),
  );
  if (!m) return { ok: false, error: 'no_dxh' };
  try {
    const json = decodeDisneyExtremeBase64Url(m[1]);
    return parseDisneyExtremeBaselineHistory(json);
  } catch {
    return { ok: false, error: 'decode_failed' };
  }
}

/**
 * Read Extreme baseline history from location.hash if `dxh=` is present.
 * @param {{ hash?: string }} [loc]
 * @returns {{ ok: true, history: object[] }|{ ok: false, error: string }}
 */
export function loadDisneyExtremeBaselineHistoryFromHash(loc = {}) {
  const hash =
    loc.hash ||
    (typeof location !== 'undefined' ? location.hash : '') ||
    '';
  if (!hash.includes(`${DISNEY_EXTREME_HISTORY_HASH_PARAM}=`)) {
    return { ok: false, error: 'no_dxh' };
  }
  return decodeDisneyExtremeBaselineHistoryHash(hash);
}

/**
 * Build share URL with Extreme baseline history in hash (`dxh=`).
 * Merges with existing hash params by default (replaces prior dxh=).
 * @param {object[]|{ history?: object[] }|null|undefined} [historyOrOpts]
 * @param {{ baseUrl?: string, hash?: string, mergeHash?: boolean }} [opts]
 * @returns {{ ok: boolean, url: string, hash: string }}
 */
export function buildDisneyExtremeBaselineHistoryShareUrl(
  historyOrOpts = {},
  opts = {},
) {
  const frag = encodeDisneyExtremeBaselineHistoryHash(historyOrOpts);
  let hash = frag;
  if (opts.mergeHash !== false) {
    const existing = String(
      opts.hash ||
        (typeof location !== 'undefined' ? location.hash : '') ||
        '',
    ).replace(/^#/, '');
    if (existing) {
      const parts = existing
        .split('&')
        .filter(
          (p) =>
            p &&
            !p.startsWith(`${DISNEY_EXTREME_HISTORY_HASH_PARAM}=`),
        );
      parts.push(frag);
      hash = parts.join('&');
    }
  }
  const base =
    opts.baseUrl ||
    (typeof location !== 'undefined'
      ? `${location.origin}${location.pathname}${location.search}`
      : '');
  return {
    ok: true,
    url: base ? `${base}#${hash}` : `#${hash}`,
    hash,
  };
}

/**
 * Encode Extreme baseline redo → URL hash fragment (`#dxr=...` base64url JSON).
 * @param {object[]|{ redo?: object[] }|null|undefined} [redoOrOpts]
 * @returns {string}
 */
export function encodeDisneyExtremeBaselineRedoHash(redoOrOpts = {}) {
  const redo = Array.isArray(redoOrOpts)
    ? redoOrOpts
    : Array.isArray(redoOrOpts?.redo)
      ? redoOrOpts.redo
      : [];
  const json = serializeDisneyExtremeBaselineRedo(redo);
  return `${DISNEY_EXTREME_REDO_HASH_PARAM}=${encodeDisneyExtremeBase64Url(json)}`;
}

/**
 * Decode `#dxr=...` or raw dxr= payload → Extreme baseline redo stack.
 * @param {string} hashOrQuery
 * @returns {{ ok: true, redo: object[] }|{ ok: false, error: string }}
 */
export function decodeDisneyExtremeBaselineRedoHash(hashOrQuery) {
  if (!hashOrQuery || typeof hashOrQuery !== 'string') {
    return { ok: false, error: 'empty' };
  }
  let raw = hashOrQuery.replace(/^#/, '');
  const m = raw.match(
    new RegExp(`(?:^|&)?${DISNEY_EXTREME_REDO_HASH_PARAM}=([^&]+)`),
  );
  if (!m) return { ok: false, error: 'no_dxr' };
  try {
    const json = decodeDisneyExtremeBase64Url(m[1]);
    return parseDisneyExtremeBaselineRedo(json);
  } catch {
    return { ok: false, error: 'decode_failed' };
  }
}

/**
 * Read Extreme baseline redo from location.hash if `dxr=` is present.
 * @param {{ hash?: string }} [loc]
 * @returns {{ ok: true, redo: object[] }|{ ok: false, error: string }}
 */
export function loadDisneyExtremeBaselineRedoFromHash(loc = {}) {
  const hash =
    loc.hash ||
    (typeof location !== 'undefined' ? location.hash : '') ||
    '';
  if (!hash.includes(`${DISNEY_EXTREME_REDO_HASH_PARAM}=`)) {
    return { ok: false, error: 'no_dxr' };
  }
  return decodeDisneyExtremeBaselineRedoHash(hash);
}

/**
 * Build share URL with Extreme baseline redo in hash (`dxr=`).
 * Merges with existing hash params by default (replaces prior dxr=).
 * @param {object[]|{ redo?: object[] }|null|undefined} [redoOrOpts]
 * @param {{ baseUrl?: string, hash?: string, mergeHash?: boolean }} [opts]
 * @returns {{ ok: boolean, url: string, hash: string }}
 */
export function buildDisneyExtremeBaselineRedoShareUrl(
  redoOrOpts = {},
  opts = {},
) {
  const frag = encodeDisneyExtremeBaselineRedoHash(redoOrOpts);
  let hash = frag;
  if (opts.mergeHash !== false) {
    const existing = String(
      opts.hash ||
        (typeof location !== 'undefined' ? location.hash : '') ||
        '',
    ).replace(/^#/, '');
    if (existing) {
      const parts = existing
        .split('&')
        .filter(
          (p) =>
            p && !p.startsWith(`${DISNEY_EXTREME_REDO_HASH_PARAM}=`),
        );
      parts.push(frag);
      hash = parts.join('&');
    }
  }
  const base =
    opts.baseUrl ||
    (typeof location !== 'undefined'
      ? `${location.origin}${location.pathname}${location.search}`
      : '');
  return {
    ok: true,
    url: base ? `${base}#${hash}` : `#${hash}`,
    hash,
  };
}

/**
 * Encode Extreme baseline favorites → URL hash fragment (`#dxf=...` base64url JSON).
 * @param {object[]|{ favorites?: object[] }|null|undefined} [favoritesOrOpts]
 * @returns {string}
 */
export function encodeDisneyExtremeBaselineFavoritesHash(favoritesOrOpts = {}) {
  const favorites = Array.isArray(favoritesOrOpts)
    ? favoritesOrOpts
    : Array.isArray(favoritesOrOpts?.favorites)
      ? favoritesOrOpts.favorites
      : [];
  const json = serializeDisneyExtremeBaselineFavorites(favorites);
  return `${DISNEY_EXTREME_FAVORITES_HASH_PARAM}=${encodeDisneyExtremeBase64Url(json)}`;
}

/**
 * Decode `#dxf=...` or raw dxf= payload → Extreme baseline favorites.
 * @param {string} hashOrQuery
 * @returns {{ ok: true, favorites: object[] }|{ ok: false, error: string }}
 */
export function decodeDisneyExtremeBaselineFavoritesHash(hashOrQuery) {
  if (!hashOrQuery || typeof hashOrQuery !== 'string') {
    return { ok: false, error: 'empty' };
  }
  let raw = hashOrQuery.replace(/^#/, '');
  const m = raw.match(
    new RegExp(`(?:^|&)?${DISNEY_EXTREME_FAVORITES_HASH_PARAM}=([^&]+)`),
  );
  if (!m) return { ok: false, error: 'no_dxf' };
  try {
    const json = decodeDisneyExtremeBase64Url(m[1]);
    return parseDisneyExtremeBaselineFavorites(json);
  } catch {
    return { ok: false, error: 'decode_failed' };
  }
}

/**
 * Read Extreme baseline favorites from location.hash if `dxf=` is present.
 * @param {{ hash?: string }} [loc]
 * @returns {{ ok: true, favorites: object[] }|{ ok: false, error: string }}
 */
export function loadDisneyExtremeBaselineFavoritesFromHash(loc = {}) {
  const hash =
    loc.hash ||
    (typeof location !== 'undefined' ? location.hash : '') ||
    '';
  if (!hash.includes(`${DISNEY_EXTREME_FAVORITES_HASH_PARAM}=`)) {
    return { ok: false, error: 'no_dxf' };
  }
  return decodeDisneyExtremeBaselineFavoritesHash(hash);
}

/**
 * Build share URL with Extreme baseline favorites in hash (`dxf=`).
 * Merges with existing hash params by default (replaces prior dxf=).
 * @param {object[]|{ favorites?: object[] }|null|undefined} [favoritesOrOpts]
 * @param {{ baseUrl?: string, hash?: string, mergeHash?: boolean }} [opts]
 * @returns {{ ok: boolean, url: string, hash: string }}
 */
export function buildDisneyExtremeBaselineFavoritesShareUrl(
  favoritesOrOpts = {},
  opts = {},
) {
  const frag = encodeDisneyExtremeBaselineFavoritesHash(favoritesOrOpts);
  let hash = frag;
  if (opts.mergeHash !== false) {
    const existing = String(
      opts.hash ||
        (typeof location !== 'undefined' ? location.hash : '') ||
        '',
    ).replace(/^#/, '');
    if (existing) {
      const parts = existing
        .split('&')
        .filter(
          (p) =>
            p &&
            !p.startsWith(`${DISNEY_EXTREME_FAVORITES_HASH_PARAM}=`),
        );
      parts.push(frag);
      hash = parts.join('&');
    }
  }
  const base =
    opts.baseUrl ||
    (typeof location !== 'undefined'
      ? `${location.origin}${location.pathname}${location.search}`
      : '');
  return {
    ok: true,
    url: base ? `${base}#${hash}` : `#${hash}`,
    hash,
  };
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
 * Clipboard-friendly Extreme snapshot diff (header + per-field lines).
 * @param {object|null|undefined} current
 * @param {object|null|undefined} baseline
 * @returns {string}
 */
export function formatDisneyExtremeSnapshotDiffCopyText(current, baseline) {
  if (!baseline) return 'diff · no baseline';
  const left =
    current && typeof current === 'object' && typeof current.shapeInt === 'number'
      ? current
      : buildDisneyExtremeLiveSnapshot(current || { enabled: false });
  const right =
    baseline &&
    typeof baseline === 'object' &&
    typeof baseline.shapeInt === 'number'
      ? baseline
      : buildDisneyExtremeLiveSnapshot(baseline || { enabled: false });
  const diff = diffDisneyExtremeSnapshots(left, right);
  const fp = disneyExtremeSnapshotFingerprintShort(right);
  const dirtyBit = diff.equal ? 'clean' : 'dirty';
  const header = `${formatDisneyExtremeSnapshotDiffLabel(diff)} · ${dirtyBit} · fp ${fp}`;
  if (diff.equal) return header;
  const lines = diff.changes.map((key) => {
    const from = right[key];
    const to = left[key];
    if (typeof from === 'boolean' || typeof to === 'boolean') {
      return `${key}: ${from ? 'on' : 'off'} → ${to ? 'on' : 'off'}`;
    }
    const a = Number(from);
    const b = Number(to);
    return `${key}: ${a.toFixed(2)} → ${b.toFixed(2)}`;
  });
  return [header, ...lines].join('\n');
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
 * Optional `changeCount` appends ×N when dirty.
 * @param {{ hasBaseline?: boolean, dirty?: boolean, fp?: string, changeCount?: number }} [opts]
 * @returns {{ bit: string, dirty: boolean, hasBaseline: boolean, fp: string, changeCount: number }}
 */
export function formatDisneyExtremeDirtyHudBit(opts = {}) {
  const hasBaseline = !!opts.hasBaseline;
  const dirty = hasBaseline && !!opts.dirty;
  const fp =
    hasBaseline && typeof opts.fp === 'string' && opts.fp
      ? String(opts.fp)
      : '';
  const fpBit = fp ? ` ${fp}` : '';
  const changeCount = dirty
    ? Math.max(0, Math.floor(Number(opts.changeCount) || 0))
    : 0;
  const dirtyWord =
    changeCount > 0 ? ` · dirty×${changeCount}` : ' · dirty';
  return {
    hasBaseline,
    dirty,
    fp,
    changeCount,
    bit: !hasBaseline ? '' : dirty ? `${dirtyWord}${fpBit}` : ` · clean${fpBit}`,
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

export const DISNEY_EXTREME_BASELINE_HISTORY_LIMIT = 8;
export const DISNEY_EXTREME_BASELINE_FAVORITES_LIMIT = 4;

/**
 * Push a captured baseline onto a history stack (skips duplicate of tip).
 * @param {object[]|null|undefined} history
 * @param {object|null|undefined} snap
 * @param {{ limit?: number }} [opts]
 * @returns {object[]}
 */
export function pushDisneyExtremeBaselineHistory(history, snap, opts = {}) {
  const limit = Math.max(
    1,
    Math.floor(Number(opts.limit) || DISNEY_EXTREME_BASELINE_HISTORY_LIMIT),
  );
  const captured = captureDisneyExtremeBaseline(snap);
  const next = Array.isArray(history) ? history.slice() : [];
  if (!captured) return next;
  const tip = next[next.length - 1];
  if (
    tip &&
    disneyExtremeSnapshotFingerprint(tip) ===
      disneyExtremeSnapshotFingerprint(captured)
  ) {
    return next;
  }
  next.push(captured);
  while (next.length > limit) next.shift();
  return next;
}

/**
 * Pop the most recent baseline from history.
 * @param {object[]|null|undefined} history
 * @returns {{ history: object[], snap: object|null }}
 */
export function popDisneyExtremeBaselineHistory(history) {
  const next = Array.isArray(history) ? history.slice() : [];
  const snap = next.length ? next.pop() : null;
  return { history: next, snap: snap || null };
}

/**
 * Tooltip / status summary for Extreme baseline dirty tracking.
 * Optional `historyDepth` / `redoDepth` / `favoritesDepth` append · hist N / · redo N / · fav N when > 0.
 * @param {{ hasBaseline?: boolean, dirty?: boolean, fp?: string, historyDepth?: number, redoDepth?: number, favoritesDepth?: number }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeBaselineSummary(opts = {}) {
  const histN = Math.max(0, Math.floor(Number(opts.historyDepth) || 0));
  const redoN = Math.max(0, Math.floor(Number(opts.redoDepth) || 0));
  const favN = Math.max(0, Math.floor(Number(opts.favoritesDepth) || 0));
  const histBit = histN > 0 ? ` · hist ${histN}` : '';
  const redoBit = redoN > 0 ? ` · redo ${redoN}` : '';
  const favBit = favN > 0 ? ` · fav ${favN}` : '';
  const trail =
    ' · D diff · ⇧D restore · K clear · P pin · U undo · ⇧U redo';
  if (!opts.hasBaseline) {
    return `baseline · none${histBit}${redoBit}${favBit}${trail}`;
  }
  const state = opts.dirty ? 'dirty' : 'clean';
  const fp =
    typeof opts.fp === 'string' && opts.fp ? ` · fp ${opts.fp}` : '';
  return `baseline · ${state}${fp}${histBit}${redoBit}${favBit}${trail}`;
}

/**
 * One-line label for a baseline history entry (list / chip / tooltip).
 * Optional `kind: 'redo'` uses R#n prefix; `kind: 'fav'` uses F#n.
 * @param {object|null|undefined} snap
 * @param {{ index?: number, compact?: boolean, kind?: 'hist'|'redo'|'fav' }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeBaselineHistoryEntry(snap, opts = {}) {
  const captured = captureDisneyExtremeBaseline(snap);
  if (!captured) return '—';
  const fp = disneyExtremeSnapshotFingerprintShort(captured);
  const n = Math.max(1, Math.floor(Number(opts.index) || 1));
  const tag =
    opts.kind === 'redo' ? `R#${n}` : opts.kind === 'fav' ? `F#${n}` : `#${n}`;
  if (opts.compact) return `${tag} ${fp}`;
  if (!captured.enabled) return `${tag} off · fp ${fp}`;
  const body = captured.bodyOn
    ? `body×${Number(captured.bodyFactor).toFixed(2)}`
    : 'body off';
  return `${tag} fp ${fp} · shape×${Number(captured.shapeFactor).toFixed(2)} · ${body} · eye×${Number(captured.eyeFactor).toFixed(2)} · mouth×${Number(captured.mouthFactor).toFixed(2)}`;
}

/**
 * Status flash / legend for Extreme baseline history stack.
 * Optional `redo` lists redo chips; `redoDepth` alone appends · redo N.
 * @param {object[]|null|undefined} history
 * @param {{ redoDepth?: number, redo?: object[] }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeBaselineHistoryList(history, opts = {}) {
  const list = Array.isArray(history) ? history : [];
  const redoList = Array.isArray(opts.redo) ? opts.redo : [];
  const redoN = Math.max(
    redoList.length,
    Math.max(0, Math.floor(Number(opts.redoDepth) || 0)),
  );
  const parts = list.map((snap, i) =>
    formatDisneyExtremeBaselineHistoryEntry(snap, {
      index: i + 1,
      compact: true,
    }),
  );
  const redoParts = redoList.map((snap, i) =>
    formatDisneyExtremeBaselineHistoryEntry(snap, {
      index: i + 1,
      compact: true,
      kind: 'redo',
    }),
  );
  const redoBit = redoParts.length
    ? ` · ${redoParts.join(' · ')}`
    : redoN > 0
      ? ` · redo ${redoN}`
      : '';
  const trail = ' · U undo · ⇧U redo · L list · ⇧L copy';
  if (!list.length) {
    return `hist · empty${redoBit}${trail}`;
  }
  return `hist ${list.length}${redoBit} · ${parts.join(' · ')}${trail}`;
}

/**
 * Dry-run preview for a hist/redo chip (Meta+click without applying).
 * @param {object|null|undefined} snap
 * @param {{ index?: number, kind?: 'hist'|'redo' }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeBaselineChipPreviewLabel(snap, opts = {}) {
  const kind =
    opts.kind === 'redo' ? 'redo' : opts.kind === 'fav' ? 'fav' : 'hist';
  const entry = formatDisneyExtremeBaselineHistoryEntry(snap, {
    index: opts.index,
    kind:
      opts.kind === 'redo' ? 'redo' : opts.kind === 'fav' ? 'fav' : undefined,
  });
  if (entry === '—') return `preview · ${kind} · invalid`;
  return `preview · ${kind} · ${entry}`;
}

/**
 * Diff live Extreme snapshot vs a hist/redo chip (Alt+click).
 * @param {object|null|undefined} current
 * @param {object|null|undefined} chipSnap
 * @param {{ index?: number, kind?: 'hist'|'redo' }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeBaselineChipDiffLabel(
  current,
  chipSnap,
  opts = {},
) {
  const kind = opts.kind === 'redo' ? 'redo' : 'hist';
  const entry = formatDisneyExtremeBaselineHistoryEntry(chipSnap, {
    index: opts.index,
    compact: true,
    kind: opts.kind === 'redo' ? 'redo' : undefined,
  });
  if (entry === '—') return `chip · ${kind} · invalid`;
  if (!chipSnap) return `chip · ${kind} · invalid`;
  const diff = diffDisneyExtremeSnapshots(current, chipSnap);
  const bit = formatDisneyExtremeSnapshotDiffLabel(diff);
  return `chip · ${entry} · ${bit}`;
}

/**
 * Diff two Extreme hist/redo chips (Shift+Alt+click vs remembered chip).
 * @param {object|null|undefined} aSnap
 * @param {object|null|undefined} bSnap
 * @param {{ aIndex?: number, bIndex?: number, aKind?: 'hist'|'redo', bKind?: 'hist'|'redo' }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeBaselineChipCompareLabel(
  aSnap,
  bSnap,
  opts = {},
) {
  const aKind = opts.aKind === 'redo' ? 'redo' : 'hist';
  const bKind = opts.bKind === 'redo' ? 'redo' : 'hist';
  if (!aSnap) return `compare · no A · pick chip first`;
  if (!bSnap) return `compare · ${aKind} · invalid B`;
  const aEntry = formatDisneyExtremeBaselineHistoryEntry(aSnap, {
    index: opts.aIndex,
    compact: true,
    kind: opts.aKind === 'redo' ? 'redo' : undefined,
  });
  const bEntry = formatDisneyExtremeBaselineHistoryEntry(bSnap, {
    index: opts.bIndex,
    compact: true,
    kind: opts.bKind === 'redo' ? 'redo' : undefined,
  });
  if (aEntry === '—' || bEntry === '—') {
    return `compare · ${aKind}/${bKind} · invalid`;
  }
  const diff = diffDisneyExtremeSnapshots(aSnap, bSnap);
  const bit = formatDisneyExtremeSnapshotDiffLabel(diff);
  return `compare · ${aEntry} ↔ ${bEntry} · ${bit}`;
}

/**
 * Serialize Extreme baseline history stack to versioned JSON.
 * @param {object[]|null|undefined} history
 * @param {{ pretty?: boolean }} [opts]
 * @returns {string}
 */
export function serializeDisneyExtremeBaselineHistory(history, opts = {}) {
  const list = Array.isArray(history) ? history : [];
  const items = [];
  for (const snap of list) {
    const captured = captureDisneyExtremeBaseline(snap);
    if (!captured) continue;
    items.push(JSON.parse(serializeDisneyExtremeSnapshot(captured)));
  }
  return JSON.stringify(
    {
      kind: DISNEY_EXTREME_BASELINE_HISTORY_JSON_KIND,
      items,
    },
    null,
    opts.pretty ? 2 : 0,
  );
}

/**
 * Parse clipboard / export JSON into an Extreme baseline history stack.
 * @param {string|object|null|undefined} input
 * @returns {{ ok: true, history: object[] }|{ ok: false, error: string }}
 */
export function parseDisneyExtremeBaselineHistory(input) {
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
  if (obj.kind !== DISNEY_EXTREME_BASELINE_HISTORY_JSON_KIND) {
    return { ok: false, error: 'kind' };
  }
  if (!Array.isArray(obj.items)) {
    return { ok: false, error: 'items' };
  }
  const history = [];
  for (const item of obj.items) {
    const snap = parseDisneyExtremeSnapshot(item);
    if (snap.ok) history.push(snap.snap);
  }
  return {
    ok: true,
    history: history.slice(-DISNEY_EXTREME_BASELINE_HISTORY_LIMIT),
  };
}

/**
 * Serialize Extreme baseline redo stack to versioned JSON.
 * @param {object[]|null|undefined} redo
 * @param {{ pretty?: boolean }} [opts]
 * @returns {string}
 */
export function serializeDisneyExtremeBaselineRedo(redo, opts = {}) {
  const list = Array.isArray(redo) ? redo : [];
  const items = [];
  for (const snap of list) {
    const captured = captureDisneyExtremeBaseline(snap);
    if (!captured) continue;
    items.push(JSON.parse(serializeDisneyExtremeSnapshot(captured)));
  }
  return JSON.stringify(
    {
      kind: DISNEY_EXTREME_BASELINE_REDO_JSON_KIND,
      items,
    },
    null,
    opts.pretty ? 2 : 0,
  );
}

/**
 * Parse clipboard / export JSON into an Extreme baseline redo stack.
 * @param {string|object|null|undefined} input
 * @returns {{ ok: true, redo: object[] }|{ ok: false, error: string }}
 */
export function parseDisneyExtremeBaselineRedo(input) {
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
  if (obj.kind !== DISNEY_EXTREME_BASELINE_REDO_JSON_KIND) {
    return { ok: false, error: 'kind' };
  }
  if (!Array.isArray(obj.items)) {
    return { ok: false, error: 'items' };
  }
  const redo = [];
  for (const item of obj.items) {
    const snap = parseDisneyExtremeSnapshot(item);
    if (snap.ok) redo.push(snap.snap);
  }
  return {
    ok: true,
    redo: redo.slice(-DISNEY_EXTREME_BASELINE_HISTORY_LIMIT),
  };
}

/**
 * Dry-run preview label for an Extreme baseline history payload.
 * @param {object[]|{ history?: object[] }|null|undefined} historyOrOpts
 * @returns {string}
 */
export function formatDisneyExtremeBaselineHistoryPreviewLabel(
  historyOrOpts = {},
) {
  const list = Array.isArray(historyOrOpts)
    ? historyOrOpts
    : Array.isArray(historyOrOpts?.history)
      ? historyOrOpts.history
      : null;
  if (!list) return 'preview · hist · invalid';
  if (!list.length) return 'preview · hist · empty';
  const tip = formatDisneyExtremeBaselineHistoryEntry(list[list.length - 1], {
    index: list.length,
    compact: true,
  });
  return `preview · hist ${list.length} · tip ${tip}`;
}

/**
 * Whether Extreme favorites have anything to wipe.
 * @param {{ favoritesDepth?: number, favorites?: object[] }} [opts]
 * @returns {boolean}
 */
export function hasDisneyExtremeBaselineFavorites(opts = {}) {
  const favLen = Array.isArray(opts.favorites)
    ? opts.favorites.length
    : Math.max(0, Math.floor(Number(opts.favoritesDepth) || 0));
  return favLen > 0;
}

/**
 * Whether Extreme redo stack has anything to wipe.
 * @param {{ redoDepth?: number, redo?: object[] }} [opts]
 * @returns {boolean}
 */
export function hasDisneyExtremeBaselineRedo(opts = {}) {
  const redoLen = Array.isArray(opts.redo)
    ? opts.redo.length
    : Math.max(0, Math.floor(Number(opts.redoDepth) || 0));
  return redoLen > 0;
}

/**
 * Dry-run preview label for an Extreme baseline favorites payload.
 * @param {object[]|{ favorites?: object[] }|null|undefined} favoritesOrOpts
 * @returns {string}
 */
export function formatDisneyExtremeBaselineFavoritesPreviewLabel(
  favoritesOrOpts = {},
) {
  const list = Array.isArray(favoritesOrOpts)
    ? favoritesOrOpts
    : Array.isArray(favoritesOrOpts?.favorites)
      ? favoritesOrOpts.favorites
      : null;
  if (!list) return 'preview · fav · invalid';
  if (!list.length) return 'preview · fav · empty';
  const tip = formatDisneyExtremeBaselineHistoryEntry(list[list.length - 1], {
    index: list.length,
    compact: true,
    kind: 'fav',
  });
  return `preview · fav ${list.length} · tip ${tip}`;
}

/**
 * Dry-run preview label for an Extreme baseline redo payload.
 * @param {object[]|{ redo?: object[] }|null|undefined} redoOrOpts
 * @returns {string}
 */
export function formatDisneyExtremeBaselineRedoPreviewLabel(redoOrOpts = {}) {
  const list = Array.isArray(redoOrOpts)
    ? redoOrOpts
    : Array.isArray(redoOrOpts?.redo)
      ? redoOrOpts.redo
      : null;
  if (!list) return 'preview · redo · invalid';
  if (!list.length) return 'preview · redo · empty';
  const tip = formatDisneyExtremeBaselineHistoryEntry(list[list.length - 1], {
    index: list.length,
    compact: true,
    kind: 'redo',
  });
  return `preview · redo ${list.length} · tip ${tip}`;
}

/**
 * One-line dry-run preview for an Extreme snapshot (drop Meta / paste check).
 * @param {ReturnType<typeof buildDisneyExtremeLiveSnapshot>|object|null|undefined} snapOrOpts
 * @returns {string}
 */
export function formatDisneyExtremeSnapshotPreviewLabel(snapOrOpts = {}) {
  if (!snapOrOpts || typeof snapOrOpts !== 'object') {
    return 'preview · invalid';
  }
  const snap =
    typeof snapOrOpts.shapeInt === 'number' &&
    typeof snapOrOpts.ease === 'number'
      ? snapOrOpts
      : buildDisneyExtremeLiveSnapshot(snapOrOpts);
  const fp = disneyExtremeSnapshotFingerprintShort(snap);
  if (!snap.enabled) return `preview · off · fp ${fp}`;
  const body = snap.bodyOn
    ? `body×${Number(snap.bodyFactor).toFixed(2)}`
    : 'body off';
  return `preview · shape×${Number(snap.shapeFactor).toFixed(2)} · ${body} · eye×${Number(snap.eyeFactor).toFixed(2)} · mouth×${Number(snap.mouthFactor).toFixed(2)} · fp ${fp}`;
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

export const DISNEY_EXTREME_BASELINE_HISTORY_STORAGE_KEY =
  'amoji.disneyExtreme.baselineHistory.v1';

export const DISNEY_EXTREME_BASELINE_HISTORY_JSON_KIND =
  'amoji.disneyExtreme.baselineHistory.v1';

/**
 * Persist Extreme baseline history stack (sessionStorage by default).
 * @param {object[]|null|undefined} history
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 * @returns {{ ok: boolean, count: number }}
 */
export function saveDisneyExtremeBaselineHistory(history, opts = {}) {
  const list = Array.isArray(history) ? history : [];
  const storage = resolveDisneyExtremeBaselineStorage(opts);
  if (!storage) return { ok: true, count: list.length };
  try {
    if (!list.length) {
      storage.removeItem(DISNEY_EXTREME_BASELINE_HISTORY_STORAGE_KEY);
      return { ok: true, count: 0 };
    }
    const items = [];
    for (const snap of list) {
      const captured = captureDisneyExtremeBaseline(snap);
      if (!captured) continue;
      items.push(JSON.parse(serializeDisneyExtremeSnapshot(captured)));
    }
    storage.setItem(
      DISNEY_EXTREME_BASELINE_HISTORY_STORAGE_KEY,
      JSON.stringify({
        kind: DISNEY_EXTREME_BASELINE_HISTORY_JSON_KIND,
        items,
      }),
    );
    return { ok: true, count: items.length };
  } catch {
    return { ok: false, count: list.length };
  }
}

/**
 * Load Extreme baseline history from sessionStorage (or injected storage).
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 * @returns {object[]}
 */
export function loadDisneyExtremeBaselineHistory(opts = {}) {
  const storage = resolveDisneyExtremeBaselineStorage(opts);
  if (!storage) return [];
  try {
    const raw = storage.getItem(DISNEY_EXTREME_BASELINE_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      parsed.kind !== DISNEY_EXTREME_BASELINE_HISTORY_JSON_KIND ||
      !Array.isArray(parsed.items)
    ) {
      return [];
    }
    const out = [];
    for (const item of parsed.items) {
      const snap = parseDisneyExtremeSnapshot(item);
      if (snap.ok) out.push(snap.snap);
    }
    return out.slice(-DISNEY_EXTREME_BASELINE_HISTORY_LIMIT);
  } catch {
    return [];
  }
}

/**
 * Clear persisted Extreme baseline history.
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 * @returns {{ ok: boolean }}
 */
export function clearDisneyExtremeBaselineHistoryStorage(opts = {}) {
  const storage = resolveDisneyExtremeBaselineStorage(opts);
  if (storage) {
    try {
      storage.removeItem(DISNEY_EXTREME_BASELINE_HISTORY_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return { ok: true };
}

export const DISNEY_EXTREME_BASELINE_REDO_STORAGE_KEY =
  'amoji.disneyExtreme.baselineRedo.v1';

export const DISNEY_EXTREME_BASELINE_REDO_JSON_KIND =
  'amoji.disneyExtreme.baselineRedo.v1';

/**
 * Persist Extreme baseline redo stack (sessionStorage by default).
 * @param {object[]|null|undefined} redo
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 * @returns {{ ok: boolean, count: number }}
 */
export function saveDisneyExtremeBaselineRedo(redo, opts = {}) {
  const list = Array.isArray(redo) ? redo : [];
  const storage = resolveDisneyExtremeBaselineStorage(opts);
  if (!storage) return { ok: true, count: list.length };
  try {
    if (!list.length) {
      storage.removeItem(DISNEY_EXTREME_BASELINE_REDO_STORAGE_KEY);
      return { ok: true, count: 0 };
    }
    const items = [];
    for (const snap of list) {
      const captured = captureDisneyExtremeBaseline(snap);
      if (!captured) continue;
      items.push(JSON.parse(serializeDisneyExtremeSnapshot(captured)));
    }
    storage.setItem(
      DISNEY_EXTREME_BASELINE_REDO_STORAGE_KEY,
      JSON.stringify({
        kind: DISNEY_EXTREME_BASELINE_REDO_JSON_KIND,
        items,
      }),
    );
    return { ok: true, count: items.length };
  } catch {
    return { ok: false, count: list.length };
  }
}

/**
 * Load Extreme baseline redo from sessionStorage (or injected storage).
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 * @returns {object[]}
 */
export function loadDisneyExtremeBaselineRedo(opts = {}) {
  const storage = resolveDisneyExtremeBaselineStorage(opts);
  if (!storage) return [];
  try {
    const raw = storage.getItem(DISNEY_EXTREME_BASELINE_REDO_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      parsed.kind !== DISNEY_EXTREME_BASELINE_REDO_JSON_KIND ||
      !Array.isArray(parsed.items)
    ) {
      return [];
    }
    const out = [];
    for (const item of parsed.items) {
      const snap = parseDisneyExtremeSnapshot(item);
      if (snap.ok) out.push(snap.snap);
    }
    return out.slice(-DISNEY_EXTREME_BASELINE_HISTORY_LIMIT);
  } catch {
    return [];
  }
}

/**
 * Clear persisted Extreme baseline redo stack.
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 * @returns {{ ok: boolean }}
 */
export function clearDisneyExtremeBaselineRedoStorage(opts = {}) {
  const storage = resolveDisneyExtremeBaselineStorage(opts);
  if (storage) {
    try {
      storage.removeItem(DISNEY_EXTREME_BASELINE_REDO_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return { ok: true };
}

export const DISNEY_EXTREME_BASELINE_FAVORITES_STORAGE_KEY =
  'amoji.disneyExtreme.baselineFavorites.v1';

export const DISNEY_EXTREME_BASELINE_FAVORITES_JSON_KIND =
  'amoji.disneyExtreme.baselineFavorites.v1';

/**
 * Push a captured baseline onto the favorites stack (skips duplicate of tip).
 * @param {object[]|null|undefined} favorites
 * @param {object|null|undefined} snap
 * @param {{ limit?: number }} [opts]
 * @returns {object[]}
 */
export function pushDisneyExtremeBaselineFavorite(favorites, snap, opts = {}) {
  return pushDisneyExtremeBaselineHistory(favorites, snap, {
    limit:
      Math.max(
        1,
        Math.floor(
          Number(opts.limit) || DISNEY_EXTREME_BASELINE_FAVORITES_LIMIT,
        ),
      ),
  });
}

/**
 * Format Extreme favorites list for status flash.
 * @param {object[]|null|undefined} favorites
 * @returns {string}
 */
export function formatDisneyExtremeBaselineFavoritesList(favorites) {
  const list = Array.isArray(favorites) ? favorites : [];
  if (!list.length) return 'fav · empty';
  const bits = list.map((snap, i) =>
    formatDisneyExtremeBaselineHistoryEntry(snap, {
      index: i + 1,
      compact: true,
      kind: 'fav',
    }),
  );
  return `fav ${list.length} · ${bits.join(' · ')}`;
}

/**
 * Serialize Extreme baseline favorites to versioned JSON.
 * @param {object[]|null|undefined} favorites
 * @param {{ pretty?: boolean }} [opts]
 * @returns {string}
 */
export function serializeDisneyExtremeBaselineFavorites(favorites, opts = {}) {
  const list = Array.isArray(favorites) ? favorites : [];
  const items = [];
  for (const snap of list) {
    const captured = captureDisneyExtremeBaseline(snap);
    if (!captured) continue;
    items.push(JSON.parse(serializeDisneyExtremeSnapshot(captured)));
  }
  return JSON.stringify(
    {
      kind: DISNEY_EXTREME_BASELINE_FAVORITES_JSON_KIND,
      items,
    },
    null,
    opts.pretty ? 2 : 0,
  );
}

/**
 * Parse clipboard / export JSON into Extreme baseline favorites.
 * @param {string|object|null|undefined} input
 * @returns {{ ok: true, favorites: object[] }|{ ok: false, error: string }}
 */
export function parseDisneyExtremeBaselineFavorites(input) {
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
  if (obj.kind !== DISNEY_EXTREME_BASELINE_FAVORITES_JSON_KIND) {
    return { ok: false, error: 'kind' };
  }
  if (!Array.isArray(obj.items)) {
    return { ok: false, error: 'items' };
  }
  const favorites = [];
  for (const item of obj.items) {
    const snap = parseDisneyExtremeSnapshot(item);
    if (snap.ok) favorites.push(snap.snap);
  }
  return {
    ok: true,
    favorites: favorites.slice(-DISNEY_EXTREME_BASELINE_FAVORITES_LIMIT),
  };
}

/**
 * Persist Extreme baseline favorites (sessionStorage by default).
 * @param {object[]|null|undefined} favorites
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 * @returns {{ ok: boolean, count: number }}
 */
export function saveDisneyExtremeBaselineFavorites(favorites, opts = {}) {
  const list = Array.isArray(favorites) ? favorites : [];
  const storage = resolveDisneyExtremeBaselineStorage(opts);
  if (!storage) return { ok: true, count: list.length };
  try {
    if (!list.length) {
      storage.removeItem(DISNEY_EXTREME_BASELINE_FAVORITES_STORAGE_KEY);
      return { ok: true, count: 0 };
    }
    const items = [];
    for (const snap of list) {
      const captured = captureDisneyExtremeBaseline(snap);
      if (!captured) continue;
      items.push(JSON.parse(serializeDisneyExtremeSnapshot(captured)));
    }
    storage.setItem(
      DISNEY_EXTREME_BASELINE_FAVORITES_STORAGE_KEY,
      JSON.stringify({
        kind: DISNEY_EXTREME_BASELINE_FAVORITES_JSON_KIND,
        items,
      }),
    );
    return { ok: true, count: items.length };
  } catch {
    return { ok: false, count: list.length };
  }
}

/**
 * Load Extreme baseline favorites from sessionStorage (or injected storage).
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 * @returns {object[]}
 */
export function loadDisneyExtremeBaselineFavorites(opts = {}) {
  const storage = resolveDisneyExtremeBaselineStorage(opts);
  if (!storage) return [];
  try {
    const raw = storage.getItem(DISNEY_EXTREME_BASELINE_FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      parsed.kind !== DISNEY_EXTREME_BASELINE_FAVORITES_JSON_KIND ||
      !Array.isArray(parsed.items)
    ) {
      return [];
    }
    const out = [];
    for (const item of parsed.items) {
      const snap = parseDisneyExtremeSnapshot(item);
      if (snap.ok) out.push(snap.snap);
    }
    return out.slice(-DISNEY_EXTREME_BASELINE_FAVORITES_LIMIT);
  } catch {
    return [];
  }
}

/**
 * Clear persisted Extreme baseline favorites.
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 * @returns {{ ok: boolean }}
 */
export function clearDisneyExtremeBaselineFavoritesStorage(opts = {}) {
  const storage = resolveDisneyExtremeBaselineStorage(opts);
  if (storage) {
    try {
      storage.removeItem(DISNEY_EXTREME_BASELINE_FAVORITES_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return { ok: true };
}

export const DISNEY_EXTREME_BASELINE_STACKS_JSON_KIND =
  'amoji.disneyExtreme.baselineStacks.v1';

/**
 * Serialize Extreme hist + redo + favorites stacks to versioned JSON.
 * @param {{ history?: object[], redo?: object[], favorites?: object[] }|null|undefined} stacks
 * @param {{ pretty?: boolean }} [opts]
 * @returns {string}
 */
export function serializeDisneyExtremeBaselineStacks(stacks = {}, opts = {}) {
  const history = Array.isArray(stacks?.history) ? stacks.history : [];
  const redo = Array.isArray(stacks?.redo) ? stacks.redo : [];
  const favorites = Array.isArray(stacks?.favorites) ? stacks.favorites : [];
  const histItems = [];
  for (const snap of history) {
    const captured = captureDisneyExtremeBaseline(snap);
    if (!captured) continue;
    histItems.push(JSON.parse(serializeDisneyExtremeSnapshot(captured)));
  }
  const redoItems = [];
  for (const snap of redo) {
    const captured = captureDisneyExtremeBaseline(snap);
    if (!captured) continue;
    redoItems.push(JSON.parse(serializeDisneyExtremeSnapshot(captured)));
  }
  const favItems = [];
  for (const snap of favorites) {
    const captured = captureDisneyExtremeBaseline(snap);
    if (!captured) continue;
    favItems.push(JSON.parse(serializeDisneyExtremeSnapshot(captured)));
  }
  return JSON.stringify(
    {
      kind: DISNEY_EXTREME_BASELINE_STACKS_JSON_KIND,
      history: histItems.slice(-DISNEY_EXTREME_BASELINE_HISTORY_LIMIT),
      redo: redoItems.slice(-DISNEY_EXTREME_BASELINE_HISTORY_LIMIT),
      favorites: favItems.slice(-DISNEY_EXTREME_BASELINE_FAVORITES_LIMIT),
    },
    null,
    opts.pretty ? 2 : 0,
  );
}

/**
 * Parse clipboard / export JSON into Extreme hist + redo + favorites stacks.
 * @param {string|object|null|undefined} input
 * @returns {{ ok: true, history: object[], redo: object[], favorites: object[] }|{ ok: false, error: string }}
 */
export function parseDisneyExtremeBaselineStacks(input) {
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
  if (obj.kind !== DISNEY_EXTREME_BASELINE_STACKS_JSON_KIND) {
    return { ok: false, error: 'kind' };
  }
  const parseList = (items, limit) => {
    if (!Array.isArray(items)) return [];
    const out = [];
    for (const item of items) {
      const snap = parseDisneyExtremeSnapshot(item);
      if (snap.ok) out.push(snap.snap);
    }
    return out.slice(-limit);
  };
  return {
    ok: true,
    history: parseList(obj.history, DISNEY_EXTREME_BASELINE_HISTORY_LIMIT),
    redo: parseList(obj.redo, DISNEY_EXTREME_BASELINE_HISTORY_LIMIT),
    favorites: parseList(
      obj.favorites,
      DISNEY_EXTREME_BASELINE_FAVORITES_LIMIT,
    ),
  };
}

/**
 * Dry-run preview label for an Extreme stacks payload.
 * @param {{ history?: object[], redo?: object[], favorites?: object[] }|null|undefined} stacks
 * @returns {string}
 */
export function formatDisneyExtremeBaselineStacksPreviewLabel(stacks = {}) {
  if (!stacks || typeof stacks !== 'object') {
    return 'preview · stacks · invalid';
  }
  const histN = Array.isArray(stacks.history) ? stacks.history.length : 0;
  const redoN = Array.isArray(stacks.redo) ? stacks.redo.length : 0;
  const favN = Array.isArray(stacks.favorites) ? stacks.favorites.length : 0;
  if (!histN && !redoN && !favN) return 'preview · stacks · empty';
  return `preview · stacks · hist ${histN} · redo ${redoN} · fav ${favN}`;
}

/**
 * Encode Extreme baseline stacks → URL hash fragment (`#dxb=...` base64url JSON).
 * @param {{ history?: object[], redo?: object[], favorites?: object[] }|null|undefined} [stacks]
 * @returns {string}
 */
export function encodeDisneyExtremeBaselineStacksHash(stacks = {}) {
  const json = serializeDisneyExtremeBaselineStacks(stacks);
  return `${DISNEY_EXTREME_STACKS_HASH_PARAM}=${encodeDisneyExtremeBase64Url(json)}`;
}

/**
 * Decode `#dxb=...` or raw dxb= payload → Extreme baseline stacks.
 * @param {string} hashOrQuery
 * @returns {{ ok: true, history: object[], redo: object[], favorites: object[] }|{ ok: false, error: string }}
 */
export function decodeDisneyExtremeBaselineStacksHash(hashOrQuery) {
  if (!hashOrQuery || typeof hashOrQuery !== 'string') {
    return { ok: false, error: 'empty' };
  }
  let raw = hashOrQuery.replace(/^#/, '');
  const m = raw.match(
    new RegExp(`(?:^|&)?${DISNEY_EXTREME_STACKS_HASH_PARAM}=([^&]+)`),
  );
  if (!m) return { ok: false, error: 'no_dxb' };
  try {
    const json = decodeDisneyExtremeBase64Url(m[1]);
    return parseDisneyExtremeBaselineStacks(json);
  } catch {
    return { ok: false, error: 'decode_failed' };
  }
}

/**
 * Read Extreme baseline stacks from location.hash if `dxb=` is present.
 * @param {{ hash?: string }} [loc]
 * @returns {{ ok: true, history: object[], redo: object[], favorites: object[] }|{ ok: false, error: string }}
 */
export function loadDisneyExtremeBaselineStacksFromHash(loc = {}) {
  const hash =
    loc.hash ||
    (typeof location !== 'undefined' ? location.hash : '') ||
    '';
  if (!hash.includes(`${DISNEY_EXTREME_STACKS_HASH_PARAM}=`)) {
    return { ok: false, error: 'no_dxb' };
  }
  return decodeDisneyExtremeBaselineStacksHash(hash);
}

/**
 * Build share URL with Extreme baseline stacks in hash (`dxb=`).
 * Merges with existing hash params by default (replaces prior dxb=).
 * @param {{ history?: object[], redo?: object[], favorites?: object[] }|null|undefined} [stacks]
 * @param {{ baseUrl?: string, hash?: string, mergeHash?: boolean }} [opts]
 * @returns {{ ok: boolean, url: string, hash: string }}
 */
export function buildDisneyExtremeBaselineStacksShareUrl(stacks = {}, opts = {}) {
  const frag = encodeDisneyExtremeBaselineStacksHash(stacks);
  let hash = frag;
  if (opts.mergeHash !== false) {
    const existing = String(
      opts.hash ||
        (typeof location !== 'undefined' ? location.hash : '') ||
        '',
    ).replace(/^#/, '');
    if (existing) {
      const parts = existing
        .split('&')
        .filter(
          (p) =>
            p && !p.startsWith(`${DISNEY_EXTREME_STACKS_HASH_PARAM}=`),
        );
      parts.push(frag);
      hash = parts.join('&');
    }
  }
  const base =
    opts.baseUrl ||
    (typeof location !== 'undefined'
      ? `${location.origin}${location.pathname}${location.search}`
      : '');
  return {
    ok: true,
    url: base ? `${base}#${hash}` : `#${hash}`,
    hash,
  };
}

/**
 * Next/prev favorites index for Q / Shift+Q cycling.
 * First next → newest; first prev → oldest; then wrap.
 * @param {number|null|undefined} currentIndex
 * @param {number} length
 * @param {{ prev?: boolean }} [opts]
 * @returns {number|null}
 */
export function cycleDisneyExtremeBaselineFavoriteIndex(
  currentIndex,
  length,
  opts = {},
) {
  const len = Math.max(0, Math.floor(Number(length) || 0));
  if (!len) return null;
  const dir = opts.prev ? -1 : 1;
  const cur = Number(currentIndex);
  if (
    currentIndex == null ||
    !Number.isInteger(cur) ||
    cur < 0 ||
    cur >= len
  ) {
    return dir > 0 ? len - 1 : 0;
  }
  return (cur + dir + len) % len;
}

/**
 * Status label when one or more Extreme hash payloads load.
 * @param {string[]} [parts]
 * @returns {string}
 */
export function formatDisneyExtremeMultiHashLoadLabel(parts = []) {
  const list = Array.isArray(parts)
    ? parts.filter((p) => typeof p === 'string' && p.trim())
    : [];
  if (!list.length) return 'link · empty';
  return `link · ${list.join(' · ')}`;
}
