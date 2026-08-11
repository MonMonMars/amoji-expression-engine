/**
 * Synthetic happy take — ARKit curves with real onset → apex → offset timing.
 * Mimics a ~1.8s smile from video (not a still). Authoring fixture only.
 */
const FPS = 60;
const DURATION = 1.8;
const N = Math.round(DURATION * FPS);

/**
 * Smooth asymmetric envelope: fast onset, hold, slower offset.
 * @param {number} u 0..1
 */
function smileEnv(u) {
  if (u < 0.12) return 0;
  if (u < 0.35) {
    const t = (u - 0.12) / 0.23;
    return t * t * (3 - 2 * t); // smoothstep rise
  }
  if (u < 0.55) return 1;
  if (u < 0.92) {
    const t = (u - 0.55) / 0.37;
    return 1 - t * t * (3 - 2 * t) * 0.92;
  }
  return Math.max(0, 0.08 * (1 - (u - 0.92) / 0.08));
}

/** @type {object[]} */
const frames = [];
for (let i = 0; i < N; i++) {
  const u = i / (N - 1);
  const e = smileEnv(u);
  const t = i / FPS;
  // Blink mid-hold (~0.9s)
  const blink =
    t > 0.88 && t < 1.05 ? Math.sin(((t - 0.88) / 0.17) * Math.PI) * 0.85 : 0;

  frames.push({
    protocol: 'amoji.livelink.arkit.v1',
    subject: 'CaptureRef',
    frame: i,
    fps: FPS,
    t,
    blendShapes: {
      browInnerUp: 0,
      browDownLeft: e * 0.12,
      browDownRight: e * 0.1,
      browOuterUpLeft: 0,
      browOuterUpRight: 0,
      eyeSquintLeft: e * 0.42,
      eyeSquintRight: e * 0.38,
      eyeBlinkLeft: blink,
      eyeBlinkRight: blink * 0.95,
      eyeWideLeft: 0,
      eyeWideRight: 0,
      cheekSquintLeft: e * 0.28,
      cheekSquintRight: e * 0.25,
      mouthSmileLeft: e * 0.92,
      mouthSmileRight: e * 0.88,
      mouthDimpleLeft: e * 0.2,
      mouthDimpleRight: e * 0.18,
      jawOpen: e * 0.08,
      mouthClose: 0,
      mouthFrownLeft: 0,
      mouthFrownRight: 0,
      noseSneerLeft: 0,
      noseSneerRight: 0,
      // idle gaze drift (should not dominate energy)
      eyeLookInLeft: Math.sin(t * 2.1) * 0.04,
      eyeLookOutRight: Math.sin(t * 2.1) * 0.04,
    },
  });
}

export const sampleHappyTake = {
  protocol: 'amoji.capture.arkit.take.v1',
  emotion: 'happy',
  subject: 'CaptureRef',
  fps: FPS,
  note: 'Synthetic video-like take for capture-bake tests. Replace with Live Link Face NDJSON from a real performance.',
  frames,
};

export default sampleHappyTake;
