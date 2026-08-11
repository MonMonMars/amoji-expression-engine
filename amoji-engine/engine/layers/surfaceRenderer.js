/**
 * Surface Renderer — same Layer 1 emotion output → swappable presentation levels 1–10.
 */
import levelsData from '../../data/surface/levels.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const SURFACE_LEVELS = levelsData.levels;
export const SURFACE_LEVEL_IDS = Object.keys(SURFACE_LEVELS)
  .map(Number)
  .sort((a, b) => a - b);

/**
 * @param {number|string} level
 */
export function getSurfaceLevel(level) {
  const id = String(level);
  return SURFACE_LEVELS[id] || null;
}

/**
 * @param {string} emotion
 */
export function emotionValence(emotion) {
  return levelsData.emotionValence[emotion] ?? 0;
}

/**
 * @param {string} emotion
 */
export function emotionArousal(emotion) {
  return levelsData.emotionArousal[emotion] ?? 0.3;
}

/**
 * Map valence → glow HSL.
 * @param {number} valence -1..1
 * @param {number} intensity
 */
export function glowColorForValence(valence, intensity = 0.7) {
  const pal = levelsData.glowPalette;
  const t = Math.max(-1, Math.min(1, valence));
  const base = t >= 0 ? pal.positive : pal.negative;
  const n = pal.neutral;
  const w = Math.abs(t);
  const h = n.h + (base.h - n.h) * w;
  const s = n.s + (base.s - n.s) * w;
  const l = Math.min(0.78, n.l + intensity * 0.12 + w * 0.05);
  return { h, s, l, css: `hsl(${h.toFixed(0)} ${(s * 100).toFixed(0)}% ${(l * 100).toFixed(0)}%)` };
}

/**
 * Level 1 glow params from Layer 1.
 * @param {{ emotion: string, intensity: number, blink?: number }} layer1
 */
export function renderGlow(layer1) {
  const intensity = Math.max(0, Math.min(1.25, layer1.intensity ?? 0.7));
  const valence = emotionValence(layer1.emotion);
  const arousal = emotionArousal(layer1.emotion);
  const color = glowColorForValence(valence, intensity);
  let brightness = 0.35 + intensity * 0.55;
  if (layer1.blink && layer1.blink > 0.05) {
    brightness *= 1 - layer1.blink * 0.65;
  }
  return {
    brightness,
    color,
    pulseRate: 0.6 + arousal * intensity * 1.8,
    glowSpread: 0.4 + intensity * 0.5,
  };
}

/**
 * Level 2–3 simple face geometry params (corner / eyeOpen style).
 * @param {{ emotion: string, intensity: number, lookX?: number, lookY?: number }} layer1
 */
export function renderPixelFace(layer1) {
  const intensity = Math.max(0, Math.min(1.25, layer1.intensity ?? 0.7));
  const e = layer1.emotion;
  let mouthCurve = 0;
  let eyeOpen = 0.75;
  let browRaise = 0;
  if (e === 'happy' || e === 'smile_open') mouthCurve = 0.7 * intensity;
  else if (e === 'sad') mouthCurve = -0.65 * intensity;
  else if (e === 'angry') {
    mouthCurve = -0.25 * intensity;
    browRaise = -0.5 * intensity;
  } else if (e === 'fear' || e === 'surprised') {
    eyeOpen = 0.75 + 0.25 * intensity;
    browRaise = 0.55 * intensity;
    mouthCurve = e === 'surprised' ? 0.15 * intensity : -0.1 * intensity;
  } else if (e === 'disgust') mouthCurve = -0.4 * intensity;
  else if (e === 'thinking') {
    browRaise = 0.2 * intensity;
    mouthCurve = -0.05;
  }
  return {
    eyeOpen,
    browRaise,
    mouthCurve,
    lookX: layer1.lookX ?? 0,
    lookY: layer1.lookY ?? 0,
    color: glowColorForValence(emotionValence(e), intensity).css,
  };
}

/**
 * Recommend mesh / texture LOD for Face Live when switching levels.
 * @param {number|string} level
 */
export function meshTexHintsForLevel(level) {
  const def = getSurfaceLevel(level);
  if (!def) return { meshHint: null, texHint: null };
  return { meshHint: def.meshHint, texHint: def.texHint };
}

/**
 * Unified Surface Renderer entry — same Layer 1 in, level-specific params out.
 * @param {number|string} level
 * @param {{
 *   emotion: string,
 *   intensity: number,
 *   blink?: number,
 *   lookX?: number,
 *   lookY?: number,
 *   params?: Record<string, number>,
 * }} layer1
 * @param {{ blink?: number }} [timing]
 */
export function renderSurface(level, layer1, timing = {}) {
  const def = getSurfaceLevel(level);
  if (!def) {
    return applyComplianceGate(
      { kind: 'surface', error: `unknown level ${level}` },
      {},
    );
  }

  const blink = timing.blink ?? layer1.blink ?? 0;
  const input = { ...layer1, blink };

  /** @type {Record<string, unknown>} */
  let surface = {};
  if (def.id === 1) {
    surface = { mode: 'glow', ...renderGlow(input) };
  } else if (def.id === 2 || def.id === 3) {
    surface = {
      mode: def.id === 2 ? 'pixel' : 'emoji',
      ...renderPixelFace(input),
    };
  } else {
    surface = {
      mode: 'mesh',
      meshHint: def.meshHint,
      texHint: def.texHint,
      faceFidelity: def.faceFidelity,
      morphScale: def.supportsMorphs ? Math.min(1.15, 0.55 + def.faceFidelity * 0.55) : 0,
      gazeEnabled: def.supportsGaze,
      stylize: def.id <= 6 ? 'cartoon' : def.id === 7 ? 'offset' : 'real',
    };
  }

  return applyComplianceGate(
    {
      kind: 'surface',
      level: def.id,
      key: def.key,
      label: def.label,
      uncannyRisk: def.uncannyRisk,
      productLine: def.productLine,
      warning: def.warning || null,
      hardware: !!def.hardware,
      emotion: layer1.emotion,
      intensity: layer1.intensity,
      surface,
      meta: { levelDef: { summary: def.summary } },
    },
    {},
  );
}

/**
 * Small helper for Face Live HUD — risk chip color hint.
 * @param {string} risk
 */
export function uncannyRiskTone(risk) {
  if (risk === 'none' || risk === 'low') return 'ok';
  if (risk === 'low-mid' || risk === 'mid') return 'warn';
  if (risk === 'peak') return 'bad';
  return 'muted';
}
