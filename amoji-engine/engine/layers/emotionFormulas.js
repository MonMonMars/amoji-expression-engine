import { resolveIntensity } from './intensity.js';

/** @typedef {import('../types.js').EmotionParams} EmotionParams */
/** @typedef {import('../types.js').PointDelta} PointDelta */

/** @returns {EmotionParams} */
export function neutralParams() {
  return {
    valence: 0,
    arousal: 0,
    pupilLX: 0,
    pupilLY: 0,
    pupilRX: 0,
    pupilRY: 0,
  };
}

/** @param {PointDelta} a @param {PointDelta} b @param {number} u */
function lerpDelta(a = {}, b = {}, u) {
  /** @type {PointDelta} */
  const out = {};
  for (const k of /** @type {const} */ (['u', 'd', 'l', 'r'])) {
    const av = a[k] ?? 0;
    const bv = b[k] ?? 0;
    const v = av + (bv - av) * u;
    if (Math.abs(v) > 1e-9) out[k] = Number(v.toFixed(4));
  }
  return out;
}

/**
 * Piecewise-linear interpolate keyframes keyed by intensity.
 * @param {Record<number, EmotionParams>} frames
 * @param {number} t
 * @returns {EmotionParams}
 */
export function interpolateKeyframes(frames, t) {
  const keys = Object.keys(frames)
    .map(Number)
    .sort((a, b) => a - b);
  if (t <= keys[0]) return { ...frames[keys[0]] };
  if (t >= keys[keys.length - 1]) return scaleParams(frames[keys[keys.length - 1]], t / keys[keys.length - 1]);

  let lo = keys[0];
  let hi = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (t >= keys[i] && t <= keys[i + 1]) {
      lo = keys[i];
      hi = keys[i + 1];
      break;
    }
  }
  const u = hi === lo ? 0 : (t - lo) / (hi - lo);
  const A = frames[lo];
  const B = frames[hi];
  /** @type {EmotionParams} */
  const out = { ...neutralParams() };
  const pointIds = new Set([
    ...Object.keys(A).filter((k) => typeof A[k] === 'object'),
    ...Object.keys(B).filter((k) => typeof B[k] === 'object'),
  ]);
  for (const id of pointIds) {
    out[id] = lerpDelta(
      /** @type {PointDelta} */ (A[id] || {}),
      /** @type {PointDelta} */ (B[id] || {}),
      u,
    );
  }
  for (const axis of ['valence', 'arousal', 'pupilLX', 'pupilLY', 'pupilRX', 'pupilRY']) {
    const av = /** @type {number} */ (A[axis] ?? 0);
    const bv = /** @type {number} */ (B[axis] ?? 0);
    out[axis] = Number((av + (bv - av) * u).toFixed(4));
  }
  return out;
}

/** @param {EmotionParams} params @param {number} scale */
function scaleParams(params, scale) {
  if (scale <= 1.0001) return { ...params };
  /** @type {EmotionParams} */
  const out = { ...params };
  for (const [k, v] of Object.entries(params)) {
    if (v && typeof v === 'object') {
      /** @type {PointDelta} */
      const d = {};
      for (const dir of /** @type {const} */ (['u', 'd', 'l', 'r'])) {
        if (v[dir]) d[dir] = Number((v[dir] * scale).toFixed(4));
      }
      out[k] = d;
    } else if (typeof v === 'number' && k !== 'overdrive') {
      out[k] = Number((v * Math.min(scale, 1.25)).toFixed(4));
    }
  }
  return out;
}

/** Mirror left→right helper for symmetric faces. */
function mirrorMouthSide(delta) {
  /** @type {PointDelta} */
  const m = { ...delta };
  const l = m.l;
  const r = m.r;
  if (l != null || r != null) {
    m.l = r;
    m.r = l;
  }
  return m;
}

function withSymmetry(partial) {
  /** @type {EmotionParams} */
  const out = { ...neutralParams(), ...partial };
  const pairs = [
    ['EB-L1', 'EB-R1'],
    ['EB-L2', 'EB-R2'],
    ['EB-L3', 'EB-R3'],
    ['EY-L-UP', 'EY-R-UP'],
    ['EY-L-LOW', 'EY-R-LOW'],
    ['EY-L-IN', 'EY-R-IN'],
    ['EY-L-OUT', 'EY-R-OUT'],
    ['CH-L', 'CH-R'],
    ['NS-L', 'NS-R'],
  ];
  for (const [L, R] of pairs) {
    if (out[L] && !out[R]) out[R] = mirrorMouthSide(/** @type {PointDelta} */ (out[L]));
  }
  if (out['MO-L'] && !out['MO-R']) {
    out['MO-R'] = mirrorMouthSide(/** @type {PointDelta} */ (out['MO-L']));
  }
  return out;
}

/** Keyframes derived from Lilith emotion demo docs (light-24). */
const HAPPY = {
  0: neutralParams(),
  0.3: withSymmetry({
    valence: 0.35,
    arousal: 0.25,
    'EY-L-LOW': { u: 0.15 },
    'CH-L': { u: 0.2 },
    'MO-L': { u: 0.2, l: 0.15 },
  }),
  0.6: withSymmetry({
    valence: 0.65,
    arousal: 0.45,
    'EY-L-UP': { d: 0.2 },
    'EY-L-LOW': { u: 0.35 },
    'EY-L-OUT': { l: 0.15 },
    'CH-L': { u: 0.45 },
    'MO-L': { u: 0.4, l: 0.3 },
    'MO-UP': { u: 0.2 },
  }),
  1.0: withSymmetry({
    valence: 0.9,
    arousal: 0.7,
    'EB-L2': { d: 0.1 },
    'EB-L3': { d: 0.1 },
    'EY-L-UP': { d: 0.45 },
    'EY-L-LOW': { u: 0.6 },
    'EY-L-IN': { u: 0.1 },
    'EY-L-OUT': { l: 0.3 },
    'CH-L': { u: 0.8 },
    'NS-L': { l: 0.15 },
    'MO-L': { u: 0.6, l: 0.5 },
    'MO-UP': { u: 0.35 },
    'MO-LOW': { d: 0.3 },
    'MO-CTR': { d: 0.5 },
    'JW-CTR': { d: 0.4 },
  }),
};

const SAD = {
  0: neutralParams(),
  0.3: withSymmetry({
    valence: -0.35,
    arousal: 0.15,
    'EB-L1': { u: 0.15, r: 0.1 },
    'EY-L-UP': { d: 0.1 },
    'MO-L': { d: 0.15 },
    pupilLY: -0.2,
    pupilRY: -0.2,
  }),
  0.6: withSymmetry({
    valence: -0.65,
    arousal: 0.25,
    'EB-L1': { u: 0.35, r: 0.25 },
    'EY-L-UP': { d: 0.25 },
    'MO-L': { d: 0.35 },
    'JW-CTR': { u: 0.1 },
    pupilLY: -0.4,
    pupilRY: -0.4,
  }),
  1.0: withSymmetry({
    valence: -0.95,
    arousal: 0.55,
    'EB-L1': { u: 0.6, r: 0.4 },
    'EY-L-UP': { d: 0.4 },
    'EY-L-LOW': { u: 0.3 },
    'MO-L': { d: 0.6 },
    'MO-UP': { u: 0.2 },
    'MO-CTR': { d: 0.3 },
    'JW-CTR': { u: 0.35 },
    pupilLY: -0.5,
    pupilRY: -0.5,
  }),
};

/** Anger — restrained (squint) variant as default. */
const ANGRY = {
  0: neutralParams(),
  0.3: withSymmetry({
    valence: -0.35,
    arousal: 0.4,
    'EB-L1': { r: 0.15, d: 0.15 },
    'EY-L-UP': { d: 0.15 },
    'MO-L': { d: 0.1 },
  }),
  0.6: withSymmetry({
    valence: -0.6,
    arousal: 0.65,
    'EB-L1': { r: 0.35, d: 0.35 },
    'EB-L2': { d: 0.15 },
    'EB-L3': { d: 0.15 },
    'EY-L-UP': { d: 0.3 },
    'EY-L-LOW': { u: 0.15 },
    'NS-L': { l: 0.2 },
    'MO-L': { d: 0.25, l: 0.1 },
  }),
  1.0: withSymmetry({
    valence: -0.85,
    arousal: 0.95,
    'EB-L1': { r: 0.6, d: 0.6 },
    'EB-L2': { d: 0.35 },
    'EB-L3': { d: 0.35 },
    'EY-L-UP': { d: 0.4 },
    'EY-L-LOW': { u: 0.3 },
    'NS-L': { l: 0.4 },
    'MO-CTR': { d: 0.5 },
    'MO-UP': { d: 0.3 },
    'JW-CTR': { d: 0.3 },
  }),
};

const FEAR = {
  0: neutralParams(),
  0.3: withSymmetry({
    valence: -0.4,
    arousal: 0.55,
    'EB-L1': { u: 0.2, r: 0.15 },
    'EB-L2': { u: 0.2 },
    'EY-L-UP': { u: 0.25 },
    'MO-L': { l: 0.15 },
  }),
  0.6: withSymmetry({
    valence: -0.7,
    arousal: 0.8,
    'EB-L1': { u: 0.45, r: 0.3 },
    'EB-L2': { u: 0.4 },
    'EB-L3': { u: 0.25 },
    'EY-L-UP': { u: 0.55 },
    'EY-L-LOW': { d: 0.1 },
    'MO-L': { l: 0.35 },
    'MO-CTR': { d: 0.25 },
  }),
  1.0: withSymmetry({
    valence: -0.9,
    arousal: 1.0,
    'EB-L1': { u: 0.7, r: 0.45 },
    'EB-L2': { u: 0.7 },
    'EB-L3': { u: 0.45 },
    'EY-L-UP': { u: 0.9 },
    'EY-L-LOW': { d: 0.2 },
    'MO-L': { l: 0.55 },
    'MO-CTR': { d: 0.45 },
    'JW-CTR': { d: 0.25 },
  }),
};

const SURPRISED = {
  0: neutralParams(),
  0.4: withSymmetry({
    valence: 0.1,
    arousal: 0.7,
    'EB-L1': { u: 0.3 },
    'EB-L2': { u: 0.3 },
    'EB-L3': { u: 0.3 },
    'EY-L-UP': { u: 0.35 },
    'MO-UP': { u: 0.1 },
    'MO-CTR': { d: 0.25 },
  }),
  0.7: withSymmetry({
    valence: 0.15,
    arousal: 0.85,
    'EB-L1': { u: 0.6 },
    'EB-L2': { u: 0.6 },
    'EB-L3': { u: 0.6 },
    'EY-L-UP': { u: 0.65 },
    'MO-UP': { u: 0.25 },
    'MO-LOW': { d: 0.3 },
    'MO-CTR': { d: 0.55 },
    'JW-CTR': { d: 0.35 },
  }),
  1.0: withSymmetry({
    valence: 0.2,
    arousal: 1.0,
    'EB-L1': { u: 1.0 },
    'EB-L2': { u: 1.0 },
    'EB-L3': { u: 1.0 },
    'EY-L-UP': { u: 1.0 },
    'EY-L-LOW': { d: 0.1 },
    'NS-L': { l: 0.2 },
    'MO-UP': { u: 0.35 },
    'MO-LOW': { d: 0.5 },
    'MO-CTR': { d: 0.85 },
    'JW-CTR': { d: 0.55 },
  }),
};

const DISGUST = {
  0: neutralParams(),
  0.3: withSymmetry({
    valence: -0.4,
    arousal: 0.35,
    'EY-L-UP': { d: 0.15 },
    'CH-L': { u: 0.15 },
    'NS-L': { u: 0.15 },
  }),
  0.6: withSymmetry({
    valence: -0.7,
    arousal: 0.5,
    'EB-L1': { d: 0.15 },
    'EB-L2': { d: 0.15 },
    'EB-L3': { d: 0.15 },
    'EY-L-UP': { d: 0.3 },
    'CH-L': { u: 0.35 },
    'NS-L': { u: 0.35 },
    'MO-L': { d: 0.2 },
    'MO-UP': { u: 0.2 },
  }),
  1.0: withSymmetry({
    valence: -0.9,
    arousal: 0.65,
    'EB-L1': { d: 0.3 },
    'EB-L2': { d: 0.3 },
    'EB-L3': { d: 0.3 },
    'EY-L-UP': { d: 0.5 },
    'CH-L': { u: 0.6 },
    'NS-L': { u: 0.6 },
    'MO-L': { d: 0.35 },
    'MO-UP': { u: 0.4 },
  }),
};

const THINKING = {
  0: neutralParams(),
  0.3: withSymmetry({
    valence: 0,
    arousal: 0.25,
    'EB-L1': { r: 0.1 },
    pupilLX: 0.2,
    pupilLY: 0.3,
    pupilRX: 0.2,
    pupilRY: 0.3,
  }),
  0.6: {
    ...withSymmetry({
      valence: 0,
      arousal: 0.4,
      'EB-L1': { r: 0.25, d: 0.15 },
      'EB-L2': { d: 0.1 },
      'EB-L3': { d: 0.1 },
      'EY-L-UP': { d: 0.15 },
      'JW-CTR': { u: 0.1 },
      pupilLX: 0.35,
      pupilLY: 0.5,
      pupilRX: 0.35,
      pupilRY: 0.5,
    }),
    // asymmetric mouth: keep left pressed, right neutral
    'MO-L': { d: 0.1 },
    'MO-R': {},
  },
  1.0: {
    ...withSymmetry({
      valence: 0,
      arousal: 0.55,
      'EB-L1': { r: 0.35, d: 0.25 },
      'EB-L2': { d: 0.2 },
      'EB-L3': { d: 0.15 },
      'EY-L-UP': { d: 0.25 },
      'JW-CTR': { u: 0.15 },
      pupilLX: 0.4,
      pupilLY: 0.55,
      pupilRX: 0.4,
      pupilRY: 0.55,
    }),
    'MO-L': { d: 0.15 },
    'MO-R': {},
  },
};

const SUSPICIOUS = {
  0: neutralParams(),
  0.3: {
    ...withSymmetry({
      valence: -0.15,
      arousal: 0.35,
      'EY-L-UP': { d: 0.15 },
      pupilLX: 0.15,
      pupilRX: 0.15,
    }),
    'EB-L1': { u: 0.2 },
    'EB-R1': { d: 0.05 },
  },
  0.6: {
    ...withSymmetry({
      valence: -0.25,
      arousal: 0.45,
      'EY-L-UP': { d: 0.3 },
      'MO-L': { d: 0.1 },
      pupilLX: 0.25,
      pupilRX: 0.25,
    }),
    'EB-L1': { u: 0.4 },
    'EB-L2': { u: 0.2 },
    'EB-R1': { d: 0.1 },
    'EB-R2': { d: 0.05 },
  },
  1.0: {
    ...withSymmetry({
      valence: -0.35,
      arousal: 0.55,
      'EY-L-UP': { d: 0.45 },
      'MO-L': { d: 0.15, l: 0.1 },
      pupilLX: 0.35,
      pupilRX: 0.35,
    }),
    'EB-L1': { u: 0.55 },
    'EB-L2': { u: 0.3 },
    'EB-R1': { d: 0.15 },
    'EB-R2': { d: 0.1 },
  },
};

/**
 * @param {number} t
 * @param {{ unlockOverdrive?: boolean }} [opts]
 * @returns {EmotionParams}
 */
function makeEmotion(frames, t, opts = {}) {
  const { t: ti, overdrive } = resolveIntensity(t, opts);
  const params = interpolateKeyframes(frames, ti);
  if (overdrive) params.overdrive = true;
  return params;
}

export const emotionFormulas = {
  /** @param {number} t @param {{ unlockOverdrive?: boolean }} [opts] */
  neutral: (_t = 0, _opts) => neutralParams(),
  happy: (t, opts) => makeEmotion(HAPPY, t, opts),
  sad: (t, opts) => makeEmotion(SAD, t, opts),
  angry: (t, opts) => makeEmotion(ANGRY, t, opts),
  fear: (t, opts) => makeEmotion(FEAR, t, opts),
  surprised: (t, opts) => makeEmotion(SURPRISED, t, opts),
  disgust: (t, opts) => makeEmotion(DISGUST, t, opts),
  thinking: (t, opts) => makeEmotion(THINKING, t, opts),
  suspicious: (t, opts) => makeEmotion(SUSPICIOUS, t, opts),
};

export const BASIC_EMOTIONS = [
  'happy',
  'sad',
  'angry',
  'fear',
  'surprised',
  'disgust',
  'thinking',
  'suspicious',
];

/**
 * Evaluate an emotion formula and wrap as engine output (still needs compliance gate).
 * @param {string} emotion
 * @param {number} intensity
 * @param {{ unlockOverdrive?: boolean }} [opts]
 */
export function evaluateEmotion(emotion, intensity, opts = {}) {
  const fn = emotionFormulas[emotion] ?? emotionFormulas.neutral;
  return {
    kind: 'emotion_frame',
    emotion,
    intensity,
    params: fn(intensity, opts),
    meta: { layer: 'emotionFormulas' },
  };
}
