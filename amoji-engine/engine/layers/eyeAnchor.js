/**
 * Layer E — Eye anchor, head–eye coordination, VOR, pupil, gaze modes.
 * Builds on eyeLook morph mapping; does not replace it.
 */
import eyeData from '../../data/eyes/layer-e.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { lookToEyeMorphWeights, saccadeOffset, mergeEyeWeights } from './eyeLook.js';

export const EYE_ONLY_DEG = eyeData.eyeOnlyDeg;
export const MIXED_MAX_DEG = eyeData.mixedMaxDeg;
export const GAZE_MODES = eyeData.gazeModes;
export const PUPIL_PROFILES = eyeData.pupilProfiles;

/**
 * @param {number} deg
 * @returns {'eye'|'mixed'|'head'}
 */
export function headEyeShare(deg) {
  const a = Math.abs(deg);
  if (a < EYE_ONLY_DEG) return 'eye';
  if (a < MIXED_MAX_DEG) return 'mixed';
  return 'head';
}

/**
 * Split an angular offset into eye look [-1,1] and head yaw contribution [-1,1].
 * @param {number} offsetDeg signed degrees (horizontal)
 * @param {number} [vertDeg=0]
 */
export function resolveHeadEye(offsetDeg, vertDeg = 0) {
  const horizShare = headEyeShare(offsetDeg);
  const vertShare = headEyeShare(vertDeg);
  const absH = Math.abs(offsetDeg);
  const absV = Math.abs(vertDeg);
  const signH = offsetDeg >= 0 ? 1 : -1;
  const signV = vertDeg >= 0 ? 1 : -1;

  let eyeX = 0;
  let headYaw = 0;
  if (horizShare === 'eye') {
    eyeX = offsetDeg * eyeData.degToLook;
  } else if (horizShare === 'mixed') {
    const eyePart = EYE_ONLY_DEG * signH;
    const headPart = offsetDeg - eyePart;
    eyeX = eyePart * eyeData.degToLook;
    headYaw = headPart / 90;
  } else {
    eyeX = EYE_ONLY_DEG * signH * eyeData.degToLook * 0.85;
    headYaw = offsetDeg / 90;
  }

  let eyeY = 0;
  let headPitch = 0;
  if (vertShare === 'eye') {
    eyeY = vertDeg * eyeData.degToLook;
  } else if (vertShare === 'mixed') {
    const eyePart = EYE_ONLY_DEG * signV;
    eyeY = eyePart * eyeData.degToLook;
    headPitch = (vertDeg - eyePart) / 90;
  } else {
    eyeY = EYE_ONLY_DEG * signV * eyeData.degToLook * 0.85;
    headPitch = vertDeg / 90;
  }

  return {
    modeH: horizShare,
    modeV: vertShare,
    lookX: Math.max(-1, Math.min(1, eyeX)),
    lookY: Math.max(-1, Math.min(1, eyeY)),
    headYaw: Math.max(-1, Math.min(1, headYaw)),
    headPitch: Math.max(-1, Math.min(1, headPitch)),
    offsetDeg: { h: offsetDeg, v: vertDeg, absH, absV },
  };
}

/**
 * Vestibulo-ocular reflex: eyes counter-rotate against head motion to hold anchor.
 * @param {number} lookX
 * @param {number} lookY
 * @param {{ headYawDelta?: number, headPitchDelta?: number, gain?: number }} head
 */
export function applyVor(lookX, lookY, head = {}) {
  const g = head.gain ?? 1;
  return {
    lookX: Math.max(-1, Math.min(1, lookX - (head.headYawDelta ?? 0) * g)),
    lookY: Math.max(-1, Math.min(1, lookY - (head.headPitchDelta ?? 0) * g)),
  };
}

/**
 * @param {string} emotion
 * @param {'robot'|'human'} [profile='robot']
 */
export function pupilScaleForEmotion(emotion, profile = 'robot') {
  const table = PUPIL_PROFILES[profile] || PUPIL_PROFILES.robot;
  return table[emotion] ?? 0;
}

/**
 * Microsaccade / drift / tremor stack with emotion modulation.
 * @param {number} t
 * @param {{ emotion?: string, amp?: number }} [opts]
 */
export function fixationMicro(t, opts = {}) {
  const emotion = opts.emotion || 'neutral';
  const cfg = eyeData.microsaccade;
  let hz = cfg.neutralHz;
  if (['angry', 'fear', 'disgust', 'sad'].includes(emotion)) {
    hz *= cfg.negativeHzMul;
  } else if (emotion === 'thinking') {
    hz *= cfg.thinkingHzMul;
  }
  const amp = (opts.amp ?? cfg.amp) * (hz / cfg.neutralHz);
  const micro = saccadeOffset(t * (hz / 1.2), amp);
  const drift = {
    x: Math.sin(t * 0.37) * cfg.driftAmp,
    y: Math.cos(t * 0.29) * cfg.driftAmp * 0.8,
  };
  const tremor = {
    x: Math.sin(t * 47) * cfg.tremorAmp,
    y: Math.sin(t * 53 + 1) * cfg.tremorAmp,
  };
  // Negative stimuli bias microsaccades away from stimulus (+X assumed right)
  let biasX = 0;
  if (['angry', 'fear', 'disgust'].includes(emotion)) biasX = -0.015;
  return {
    x: micro.x + drift.x + tremor.x + biasX,
    y: micro.y + drift.y + tremor.y,
    hz,
  };
}

/**
 * Presentation triangle scan look target at time t.
 * @param {number} t
 */
export function presentationLook(t) {
  const mode = GAZE_MODES.presentation;
  const dwell = mode.anchorDwellSec;
  const pts = mode.triangle;
  const idx = Math.floor(t / dwell) % pts.length;
  const next = (idx + 1) % pts.length;
  const u = (t % dwell) / dwell;
  // smoothstep transfer
  const s = u * u * (3 - 2 * u);
  return {
    lookX: pts[idx][0] + (pts[next][0] - pts[idx][0]) * s,
    lookY: pts[idx][1] + (pts[next][1] - pts[idx][1]) * s,
    anchorIndex: idx,
  };
}

/**
 * Resolve high-level gaze direction string from script / UI.
 * @param {'lock'|'avoid'|'idle_scan'|'camera'|'presentation'|string} gaze
 * @param {{ emotion?: string, t?: number, partnerLook?: { x: number, y: number } }} [opts]
 */
export function resolveGazeDirection(gaze, opts = {}) {
  const t = opts.t ?? 0;
  const emotion = opts.emotion || 'neutral';
  const partner = opts.partnerLook || { x: 0, y: 0.05 };

  if (gaze === 'camera') {
    const c = GAZE_MODES.camera.look;
    return { lookX: c[0], lookY: c[1], state: 'locked', mode: 'camera' };
  }
  if (gaze === 'presentation') {
    const p = presentationLook(t);
    return { ...p, state: 'pursuit', mode: 'presentation' };
  }
  if (gaze === 'avoid') {
    const bias = eyeData.emotionAnchorBias[emotion] || [-0.4, -0.1];
    return { lookX: bias[0], lookY: bias[1], state: 'averted', mode: 'dyadic' };
  }
  if (gaze === 'idle_scan') {
    return {
      lookX: Math.sin(t * 0.4) * 0.35,
      lookY: Math.sin(t * 0.25 + 1) * 0.15,
      state: 'idle_scan',
      mode: 'dyadic',
    };
  }
  // lock (default)
  return {
    lookX: partner.x,
    lookY: partner.y,
    state: 'locked',
    mode: 'dyadic',
  };
}

/**
 * Full Layer E sample for one frame.
 * @param {{
 *   gaze?: string,
 *   emotion?: string,
 *   intensity?: number,
 *   t?: number,
 *   headYaw?: number,
 *   headPitch?: number,
 *   prevHeadYaw?: number,
 *   prevHeadPitch?: number,
 *   pupilProfile?: 'robot'|'human',
 *   availableMorphs?: string[],
 * }} opts
 */
export function evaluateEyes(opts = {}) {
  const t = opts.t ?? 0;
  const emotion = opts.emotion || 'neutral';
  const intensity = opts.intensity ?? 0.7;
  const gaze = resolveGazeDirection(opts.gaze || 'lock', { emotion, t });

  // Approximate degrees from normalized look for share classification when using script look
  const offsetH = gaze.lookX / eyeData.degToLook;
  const offsetV = gaze.lookY / eyeData.degToLook;
  const share = resolveHeadEye(offsetH, offsetV);

  let lookX = share.lookX;
  let lookY = share.lookY;

  const headYawDelta = (opts.headYaw ?? 0) - (opts.prevHeadYaw ?? opts.headYaw ?? 0);
  const headPitchDelta = (opts.headPitch ?? 0) - (opts.prevHeadPitch ?? opts.headPitch ?? 0);
  if (gaze.state === 'locked') {
    ({ lookX, lookY } = applyVor(lookX, lookY, { headYawDelta, headPitchDelta, gain: 0.85 }));
  }

  const micro = fixationMicro(t, { emotion });
  lookX = Math.max(-1, Math.min(1, lookX + micro.x));
  lookY = Math.max(-1, Math.min(1, lookY + micro.y));

  const pupilDelta = pupilScaleForEmotion(emotion, opts.pupilProfile || 'robot');
  const pupil = 1 + pupilDelta * Math.min(1, intensity);

  const morphs = opts.availableMorphs
    ? lookToEyeMorphWeights(lookX, lookY, opts.availableMorphs)
    : {};

  return applyComplianceGate(
    {
      kind: 'eyes',
      gaze: gaze.state,
      gazeMode: gaze.mode,
      lookX,
      lookY,
      headYaw: share.headYaw,
      headPitch: share.headPitch,
      headEyeShare: share.modeH,
      pupil,
      pupilDelta,
      microHz: micro.hz,
      morphs,
      vor: gaze.state === 'locked',
    },
    {},
  );
}

/**
 * Stateful Layer E controller.
 */
export class EyeController {
  /**
   * @param {{ gaze?: string, pupilProfile?: 'robot'|'human' }} [opts]
   */
  constructor(opts = {}) {
    this.gaze = opts.gaze || 'lock';
    this.pupilProfile = opts.pupilProfile || 'robot';
    this.time = 0;
    this.prevHeadYaw = 0;
    this.prevHeadPitch = 0;
    this.turnPhase = null;
  }

  /** @param {string} gaze */
  setGaze(gaze) {
    this.gaze = gaze;
  }

  /** Kendon turn-start: brief aversion */
  signalTurnStart() {
    this.turnPhase = { kind: 'start', t: 0.28 };
    this.gaze = 'avoid';
  }

  /** Turn-end: lock partner */
  signalTurnEnd() {
    this.turnPhase = null;
    this.gaze = 'lock';
  }

  /**
   * @param {number} dt
   * @param {{ emotion?: string, intensity?: number, headYaw?: number, headPitch?: number, availableMorphs?: string[] }} ctx
   */
  tick(dt, ctx = {}) {
    this.time += dt;
    if (this.turnPhase) {
      this.turnPhase.t -= dt;
      if (this.turnPhase.t <= 0) {
        this.turnPhase = null;
        this.gaze = 'lock';
      }
    }
    const headYaw = ctx.headYaw ?? 0;
    const headPitch = ctx.headPitch ?? 0;
    const out = evaluateEyes({
      gaze: this.gaze,
      emotion: ctx.emotion,
      intensity: ctx.intensity,
      t: this.time,
      headYaw,
      headPitch,
      prevHeadYaw: this.prevHeadYaw,
      prevHeadPitch: this.prevHeadPitch,
      pupilProfile: this.pupilProfile,
      availableMorphs: ctx.availableMorphs,
    });
    this.prevHeadYaw = headYaw;
    this.prevHeadPitch = headPitch;
    return out;
  }
}

export { lookToEyeMorphWeights, saccadeOffset, mergeEyeWeights };
