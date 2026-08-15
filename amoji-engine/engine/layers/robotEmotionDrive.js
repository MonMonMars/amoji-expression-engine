/**
 * Adapt Amoji emotion / intensity into robot morphs, android face panels,
 * and a small JSON bridge for Android / OpenBot-style consumers.
 */

/**
 * RobotExpressive (three.js / Quaternius) morph targets.
 * @type {readonly string[]}
 */
export const ROBOT_EXPRESSIVE_MORPHS = Object.freeze([
  'Angry',
  'Surprised',
  'Sad',
]);

/**
 * Map Amoji emotion id → RobotExpressive morph weights (0..1).
 * @param {string} emotion
 * @param {number} intensity
 * @returns {Record<string, number>}
 */
export function emotionToRobotExpressiveWeights(emotion, intensity = 0.7) {
  const i = Math.max(0, Math.min(1, Number(intensity) || 0));
  /** @type {Record<string, number>} */
  const out = { Angry: 0, Surprised: 0, Sad: 0 };
  const e = String(emotion || 'neutral').toLowerCase();

  if (e === 'neutral' || e === 'idle' || i < 0.05) return out;

  const routes = {
    angry: { Angry: 1 },
    rage: { Angry: 1 },
    annoyed: { Angry: 0.65 },
    contempt: { Angry: 0.45 },
    disgust: { Angry: 0.4, Sad: 0.25 },
    sad: { Sad: 1 },
    sorrow: { Sad: 1 },
    cry: { Sad: 0.9 },
    fear: { Surprised: 0.85, Sad: 0.2 },
    scared: { Surprised: 0.9 },
    surprised: { Surprised: 1 },
    shock: { Surprised: 1 },
    happy: { Surprised: 0.35 },
    joy: { Surprised: 0.4 },
    smile_open: { Surprised: 0.45 },
    laugh: { Surprised: 0.55 },
    confused: { Surprised: 0.35, Sad: 0.2 },
    thinking: { Surprised: 0.15 },
  };

  const route = routes[e] || (e.includes('ang') ? { Angry: 0.8 } : e.includes('sad') ? { Sad: 0.8 } : null);
  if (!route) return out;
  for (const [k, v] of Object.entries(route)) {
    out[k] = Math.min(1, v * i);
  }
  return out;
}

/**
 * Remap Sakura Expression_* / ARKit-style weight bags onto RobotExpressive morphs.
 * @param {Record<string, number>} sakuraOrArkit
 * @returns {Record<string, number>}
 */
export function sakuraWeightsToRobotExpressive(sakuraOrArkit = {}) {
  /** @type {Record<string, number>} */
  const out = { Angry: 0, Surprised: 0, Sad: 0 };
  const get = (re) => {
    let m = 0;
    for (const [k, v] of Object.entries(sakuraOrArkit)) {
      if (re.test(k) && v > m) m = v;
    }
    return m;
  };
  out.Angry = Math.min(
    1,
    Math.max(
      get(/angry|rage|browDown|mouthFrown/i),
      get(/Expressions_.*[Aa]ngry/),
    ),
  );
  out.Surprised = Math.min(
    1,
    Math.max(
      get(/surpris|jawOpen|eyeWide|browInnerUp|mouthOpen/i),
      get(/Expressions_.*[Ss]urpris/),
    ),
  );
  out.Sad = Math.min(
    1,
    Math.max(get(/sad|sorrow|cry|mouthFrown|browDown/i), get(/Expressions_.*[Ss]ad/)),
  );
  return out;
}

/**
 * GDBot android face-panel part for an emotion (texture key under faces/).
 * @param {string} emotion
 * @returns {'eye_open'|'eye_close'|'eye_happy'|'eye_spiral'|'smile'|'open_mouth'}
 */
export function emotionToGdbotFacePart(emotion) {
  const e = String(emotion || 'neutral').toLowerCase();
  if (e === 'happy' || e === 'joy' || e === 'smile_open') return 'smile';
  if (e === 'laugh') return 'eye_happy';
  if (e === 'surprised' || e === 'shock' || e === 'fear' || e === 'scared') {
    return 'eye_spiral';
  }
  if (e === 'sad' || e === 'sorrow' || e === 'cry') return 'eye_close';
  if (e === 'angry' || e === 'rage' || e === 'annoyed') return 'open_mouth';
  if (e === 'confused' || e === 'thinking') return 'eye_open';
  return 'eye_open';
}

/**
 * Gobot eye texture key.
 * @param {string} emotion
 * @param {{ blink?: number }} [opts]
 * @returns {'open'|'closed'|'hurt'}
 */
export function emotionToGobotEyes(emotion, opts = {}) {
  if ((opts.blink || 0) > 0.5) return 'closed';
  const e = String(emotion || 'neutral').toLowerCase();
  if (e === 'sad' || e === 'angry' || e === 'fear' || e === 'cry' || e === 'pain') {
    return 'hurt';
  }
  return 'open';
}

/**
 * Compact bridge payload for Android / OpenBot-style runtimes
 * (face panel + LED strip + optional morphs). No network I/O.
 *
 * @param {{
 *   emotion: string,
 *   intensity?: number,
 *   blink?: number,
 *   robotId?: string,
 *   morphs?: Record<string, number>,
 * }} state
 */
export function emotionToAndroidRobotBridge(state) {
  const emotion = state.emotion || 'neutral';
  const intensity = Math.max(0, Math.min(1, Number(state.intensity) || 0));
  const face = emotionToGdbotFacePart(emotion);
  const eyes = emotionToGobotEyes(emotion, { blink: state.blink });
  const morphs =
    state.morphs || emotionToRobotExpressiveWeights(emotion, intensity);

  /** Soft RGB mood for chassis LEDs / phone UI chrome */
  const ledByEmotion = {
    happy: [0.2, 0.85, 0.45],
    joy: [0.15, 0.9, 0.5],
    angry: [0.95, 0.2, 0.15],
    rage: [1, 0.1, 0.05],
    sad: [0.25, 0.35, 0.85],
    fear: [0.7, 0.35, 0.95],
    surprised: [0.95, 0.85, 0.2],
    neutral: [0.45, 0.55, 0.65],
  };
  const rgb = ledByEmotion[emotion] || ledByEmotion.neutral;

  return {
    schema: 'amoji.androidRobot.v1',
    robotId: state.robotId || 'generic',
    emotion,
    intensity,
    face: { panel: face, eyes },
    leds: {
      primary: rgb.map((c) => Number((c * intensity + (1 - intensity) * 0.2).toFixed(3))),
      blink: Number((state.blink || 0).toFixed(3)),
    },
    morphs,
    ts: Date.now(),
  };
}
