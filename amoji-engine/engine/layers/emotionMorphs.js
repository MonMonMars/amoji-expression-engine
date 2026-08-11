/**
 * Map Amoji emotion ids → morph target weights for Sakura LO/HI GLBs.
 * HI prefers fine Expressions_* keys; falls back to EMO_* combined shapes.
 * LO uses intensity sculpts (subtle / medium / peak) when present.
 */

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
export const INTENSITY_TIERS = {
  subtle: 0.33,
  medium: 0.66,
  peak: 1.0,
};

/** Fine-grained recipes for HI mesh (MB-Lab Expression_* names as exported to glTF). */
export const HI_RECIPES = {
  happy: {
    Expressions_mouthSmile_max: 0.85,
    Expressions_mouthSmileL_max: 0.55,
    Expressions_mouthSmileR_max: 0.55,
    Expressions_eyeSquintL_max: 0.35,
    Expressions_eyeSquintR_max: 0.35,
  },
  sad: {
    Expressions_mouthSmile_min: 0.55,
    Expressions_browsMidVert_max: 0.7,
    Expressions_browOutVertL_max: 0.35,
    Expressions_browOutVertR_max: 0.35,
  },
  angry: {
    Expressions_browSqueezeL_max: 0.8,
    Expressions_browSqueezeR_max: 0.8,
    Expressions_mouthOpenAggr_max: 0.35,
    Expressions_eyeSquintL_max: 0.4,
    Expressions_eyeSquintR_max: 0.4,
  },
  surprised: {
    Expressions_mouthOpenLarge_max: 0.7,
    Expressions_browsMidVert_max: 0.85,
    Expressions_browOutVertL_max: 0.55,
    Expressions_browOutVertR_max: 0.55,
  },
  fear: {
    Expressions_mouthOpen_max: 0.45,
    Expressions_browsMidVert_max: 0.6,
    Expressions_eyeClosedL_min: 0.35,
    Expressions_eyeClosedR_min: 0.35,
  },
  disgust: {
    Expressions_cheekSneerL_max: 0.7,
    Expressions_cheekSneerR_max: 0.55,
    Expressions_nostrilsExpansion_max: 0.65,
  },
  thinking: {
    Expressions_browOutVertL_max: 0.45,
    Expressions_browSqueezeR_max: 0.35,
    Expressions_mouthClosed_max: 0.4,
  },
  smile_open: {
    Expressions_mouthSmileOpen_max: 0.85,
    Expressions_eyeSquintL_max: 0.45,
    Expressions_eyeSquintR_max: 0.45,
  },
  neutral: {},
};

/**
 * Normalize glTF morph name variants (spaces / dots).
 * @param {string} name
 */
export function normalizeMorphName(name) {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Square Enix-style ease: soft in the low band, stronger near peak.
 * @param {number} t 0..1.25
 */
export function easeEmotionIntensity(t) {
  const x = Math.max(0, Math.min(1.25, t));
  if (x <= 1) {
    // smoothstep then slight lift toward 1
    const s = x * x * (3 - 2 * x);
    return s;
  }
  return 1 + (x - 1) * 0.85;
}

/**
 * Crossfade weights across subtle / medium / peak sculpt morphs.
 * @param {string} emotion
 * @param {number} intensity 0..1.25
 * @param {Set<string>} available
 * @returns {Record<string, number> | null} null if no tier morphs present
 */
export function intensityTierWeights(emotion, intensity, available) {
  const subtle = `EMO_${emotion}_subtle`;
  const medium = `EMO_${emotion}_medium`;
  const peak = `EMO_${emotion}_peak`;
  const legacy = `EMO_${emotion}`;

  const hasTiers = available.has(subtle) && available.has(medium) && available.has(peak);
  if (!hasTiers) {
    if (available.has(legacy)) {
      return { [legacy]: Math.max(0, Math.min(1.25, intensity)) };
    }
    return null;
  }

  const t = Math.max(0, Math.min(1.25, intensity));
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
    // overdrive: hold peak + residual on legacy if present
    weights[peak] = 1;
    if (available.has(legacy)) weights[legacy] = Math.min(0.35, t - 1);
  }

  // Prefer peak alias if peak key missing but legacy exists
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
  const t = Math.max(0, Math.min(1.25, intensity));
  /** @type {Record<string, number>} */
  const weights = {};
  const available = new Set(availableMorphs);

  const has = (n) => available.has(n);

  if (emotion === 'neutral' || t <= 0.001) {
    return weights;
  }

  // LO: intensity sculpts (subtle/medium/peak) or legacy EMO_
  if (lod === 'lo') {
    const tier = intensityTierWeights(emotion, t, available);
    if (tier) return tier;
    return weights;
  }

  // HI: prefer fine Expression_* keys with non-linear intensity
  const eased = easeEmotionIntensity(t);
  const recipe = HI_RECIPES[emotion] || {};
  for (const [k, v] of Object.entries(recipe)) {
    if (has(k)) weights[k] = Math.min(1, v * eased);
  }
  if (Object.keys(weights).length === 0) {
    const tier = intensityTierWeights(emotion, t, available);
    if (tier) return tier;
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
  // decay unused
  for (let i = 0; i < infl.length; i++) {
    infl[i] += (0 - infl[i]) * lerpAlpha;
  }
  for (const [name, w] of Object.entries(targetWeights)) {
    const idx = dict[name];
    if (idx === undefined) continue;
    infl[idx] += (w - infl[idx]) * lerpAlpha;
  }
}
