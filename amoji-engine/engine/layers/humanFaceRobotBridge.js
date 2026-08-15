/**
 * Adapt Amoji emotions (+ optional ARKit 52 weights) onto human-faced robots.
 * Furhat FaceCore accepts ARKit-style gesture params — strongest interop path.
 */

import { arkitNonZero } from '../export/arkitExporter.js';

/**
 * Map emotion → Furhat named gesture (when not driving custom ARKit frames).
 * @param {string} emotion
 * @param {number} intensity
 */
export function emotionToFurhatNamedGesture(emotion, intensity = 0.7) {
  const e = String(emotion || 'neutral').toLowerCase();
  const i = Math.max(0, Math.min(1, Number(intensity) || 0));
  if (e === 'happy' || e === 'joy') return i >= 0.75 ? 'BigSmile' : 'Smile';
  if (e === 'laugh' || e === 'smile_open') return 'BigSmile';
  if (e === 'sad' || e === 'sorrow' || e === 'cry') return 'ExpressSad';
  if (e === 'angry' || e === 'rage') return 'ExpressAnger';
  if (e === 'fear' || e === 'scared') return 'ExpressFear';
  if (e === 'surprised' || e === 'shock') return 'Surprise';
  if (e === 'disgust') return 'ExpressDisgust';
  if (e === 'thinking' || e === 'confused') return 'Thoughtful';
  if (e.includes('hello') || e === 'wave') return 'Oh';
  return 'Blink';
}

/**
 * Build a Furhat FaceCore gesture definition from ARKit (or ARKit-like) weights.
 * @param {Record<string, number>} arkitWeights
 * @param {{ hold?: number, name?: string }} [opts]
 */
export function arkitWeightsToFurhatGesture(arkitWeights = {}, opts = {}) {
  const hold = opts.hold ?? 0.45;
  /** @type {Record<string, number>} */
  const params = {};

  const map = {
    browInnerUp: 'BROW_UP_LEFT',
    browDownLeft: 'BROW_DOWN_LEFT',
    browDownRight: 'BROW_DOWN_RIGHT',
    browOuterUpLeft: 'BROW_UP_LEFT',
    browOuterUpRight: 'BROW_UP_RIGHT',
    eyeBlinkLeft: 'BLINK_LEFT',
    eyeBlinkRight: 'BLINK_RIGHT',
    eyeSquintLeft: 'EYE_SQUINT_LEFT',
    eyeSquintRight: 'EYE_SQUINT_RIGHT',
    jawOpen: 'PHONE_AAH',
    mouthSmileLeft: 'SMILE_CLOSED',
    mouthSmileRight: 'SMILE_CLOSED',
    mouthFrownLeft: 'EXPR_SAD',
    mouthFrownRight: 'EXPR_SAD',
    mouthFunnel: 'SURPRISE',
  };

  for (const [arkit, furhat] of Object.entries(map)) {
    const v = arkitWeights[arkit];
    if (v && v > 0.05) params[furhat] = Math.min(1, Math.max(params[furhat] || 0, v));
  }

  // Composite expression scalars Furhat also exposes
  const smile =
    Math.max(arkitWeights.mouthSmileLeft || 0, arkitWeights.mouthSmileRight || 0) ||
    params.SMILE_CLOSED ||
    0;
  if (smile > 0.55) params.SMILE_OPEN = smile;
  else if (smile > 0.05) params.SMILE_CLOSED = smile;

  const anger =
    Math.max(arkitWeights.browDownLeft || 0, arkitWeights.browDownRight || 0) *
    Math.max(arkitWeights.noseSneerLeft || 0.3, arkitWeights.noseSneerRight || 0.3);
  if (anger > 0.2) params.EXPR_ANGER = Math.min(1, anger * 2);

  return {
    class: 'furhatos.gestures.Gesture',
    name: opts.name || 'amoji_arkit',
    frames: [
      { time: [hold], params },
      { time: [hold + 0.35], params: { reset: true } },
    ],
  };
}

/**
 * Emotion → Furhat Remote API bundle (named + optional ARKit custom gesture).
 * @param {string} emotion
 * @param {number} intensity
 * @param {Record<string, number>} [arkitWeights]
 */
export function emotionToFurhatBridge(emotion, intensity = 0.7, arkitWeights) {
  const named = emotionToFurhatNamedGesture(emotion, intensity);
  const nz = arkitWeights ? arkitNonZero(arkitWeights, 0.04) : {};
  const custom =
    Object.keys(nz).length > 0
      ? arkitWeightsToFurhatGesture(arkitWeights, {
          hold: 0.35 + 0.4 * intensity,
          name: `amoji_${emotion}`,
        })
      : null;

  return {
    sdk: 'Furhat Remote API',
    baseUrlTemplate: 'http://{robot_ip}:54321',
    requests: [
      {
        method: 'POST',
        path: '/furhat/gesture',
        query: custom ? undefined : { name: named },
        body: custom ? { body: JSON.stringify(custom) } : undefined,
        note: custom
          ? 'Custom FaceCore gesture from ARKit weights'
          : `Named gesture ${named}`,
      },
      {
        method: 'POST',
        path: '/furhat/say',
        query: {
          text:
            emotion === 'happy'
              ? 'Nice to meet you!'
              : emotion === 'sad'
                ? 'I understand.'
                : '',
        },
        optional: true,
      },
    ],
    namedGesture: named,
    customGesture: custom,
    arkitNonZero: nz,
  };
}

/**
 * LuxAI QTrobot face videos.
 * @param {string} emotion
 * @param {number} intensity
 */
export function emotionToQtrobotFace(emotion, intensity = 0.7) {
  const e = String(emotion || 'neutral').toLowerCase();
  const i = Math.max(0, Math.min(1, Number(intensity) || 0));
  const table = {
    happy: 'QT/happy',
    joy: 'QT/happy',
    laugh: 'QT/laughing',
    smile_open: 'QT/happy',
    sad: 'QT/sad',
    sorrow: 'QT/cry',
    cry: 'QT/cry',
    angry: 'QT/angry',
    rage: 'QT/angry',
    surprised: 'QT/surprise',
    shock: 'QT/surprise',
    fear: 'QT/afraid',
    scared: 'QT/afraid',
    confused: 'QT/confused',
    thinking: 'QT/neutral',
    love: 'QT/kiss',
    neutral: 'QT/neutral',
  };
  return {
    sdk: 'luxai robot-sdk-python / ROS2',
    showEmotion: {
      method: 'robot.face.show_emotion',
      emotion: table[e] || 'QT/neutral',
      speed: Number((0.7 + 0.6 * i).toFixed(2)),
    },
    ros2: {
      service: '/qtrobot/face/emotion/show',
      type: 'qtrobot_interfaces/srv/FaceEmotionShow',
    },
    look:
      e === 'sad'
        ? { l_eye: [0, 20], r_eye: [0, 20], duration: 1.5 }
        : e === 'surprised'
          ? { l_eye: [0, -15], r_eye: [0, -15], duration: 1 }
          : null,
  };
}

/**
 * Engineered Arts Ameca / Mesmer DOF channels (normalized 0..1 intents).
 * @param {string} emotion
 * @param {number} intensity
 * @param {Record<string, number>} [arkitWeights]
 */
export function emotionToAmecaDofs(emotion, intensity = 0.7, arkitWeights = {}) {
  const e = String(emotion || 'neutral').toLowerCase();
  const i = Math.max(0, Math.min(1, Number(intensity) || 0));
  const a = arkitWeights;

  const dofs = {
    brow_inner_up: a.browInnerUp ?? (e === 'surprised' || e === 'fear' ? i : 0),
    brow_down_l: a.browDownLeft ?? (e === 'angry' || e === 'sad' ? i * 0.8 : 0),
    brow_down_r: a.browDownRight ?? (e === 'angry' || e === 'sad' ? i * 0.8 : 0),
    eye_wide_l: a.eyeWideLeft ?? (e === 'surprised' ? i : 0),
    eye_wide_r: a.eyeWideRight ?? (e === 'surprised' ? i : 0),
    eye_blink_l: a.eyeBlinkLeft ?? 0,
    eye_blink_r: a.eyeBlinkRight ?? 0,
    cheek_raise_l: a.cheekSquintLeft ?? (e === 'happy' || e === 'joy' ? i * 0.6 : 0),
    cheek_raise_r: a.cheekSquintRight ?? (e === 'happy' || e === 'joy' ? i * 0.6 : 0),
    jaw_open: a.jawOpen ?? (e === 'surprised' || e === 'laugh' ? i * 0.5 : 0),
    smile_l: a.mouthSmileLeft ?? (e === 'happy' || e === 'joy' || e === 'laugh' ? i : 0),
    smile_r: a.mouthSmileRight ?? (e === 'happy' || e === 'joy' || e === 'laugh' ? i : 0),
    frown_l: a.mouthFrownLeft ?? (e === 'sad' || e === 'angry' ? i * 0.7 : 0),
    frown_r: a.mouthFrownRight ?? (e === 'sad' || e === 'angry' ? i * 0.7 : 0),
  };

  /** clamp */
  for (const k of Object.keys(dofs)) {
    dofs[k] = Math.max(0, Math.min(1, Number(dofs[k]) || 0));
  }

  const preset =
    e === 'happy' || e === 'joy'
      ? 'Happy'
      : e === 'sad'
        ? 'Sad'
        : e === 'angry'
          ? 'Angry'
          : e === 'surprised'
            ? 'Surprised'
            : e === 'fear'
              ? 'Fear'
              : 'Neutral';

  return {
    sdk: 'Tritium / Engineered Arts partner API',
    presetExpression: preset,
    dofs,
    gestureClip:
      e === 'happy' ? 'wave' : e === 'sad' ? 'look_down' : e === 'angry' ? 'reject' : 'idle',
    note: 'Push DOFs via Tritium poses/animator or licensed partner endpoint',
  };
}

/**
 * Hanson Robotics named face emotions.
 * @param {string} emotion
 * @param {number} intensity
 */
export function emotionToHansonFace(emotion, intensity = 0.7) {
  const e = String(emotion || 'neutral').toLowerCase();
  const table = {
    happy: 'happy',
    joy: 'joyful',
    laugh: 'laughing',
    sad: 'sad',
    angry: 'angry',
    surprised: 'surprised',
    fear: 'afraid',
    thinking: 'thinking',
    neutral: 'neutral',
  };
  return {
    sdk: 'Hanson AI / partner',
    expression: table[e] || 'neutral',
    intensity,
    lipSync: true,
    note: 'Requires Hanson partner SDK / teleop stack',
  };
}

/**
 * iCub YARP-style face.
 * @param {string} emotion
 * @param {number} intensity
 */
export function emotionToIcubFace(emotion, intensity = 0.7) {
  const e = String(emotion || 'neutral').toLowerCase();
  return {
    sdk: 'YARP iCub',
    mouth:
      e === 'happy' || e === 'joy'
        ? 'smile'
        : e === 'sad'
          ? 'sad'
          : e === 'surprised'
            ? 'surprised'
            : 'neutral',
    eyelids: e === 'surprised' ? 0.1 : e === 'sad' ? 0.55 : 0.35,
    ledEyebrows: e === 'angry' ? 'down' : e === 'surprised' ? 'up' : 'neutral',
    intensity,
  };
}

/**
 * Digital humans (Soul Machines / Uneeq) — ARKit-ish event stream.
 * @param {string} emotion
 * @param {number} intensity
 * @param {Record<string, number>} [arkitWeights]
 */
export function emotionToDigitalHumanFace(emotion, intensity, arkitWeights = {}) {
  return {
    sdk: 'Soul Machines / Uneeq cloud',
    emotion,
    intensity,
    blendShapes: arkitNonZero(arkitWeights, 0.03),
    event: 'amoji.emotion',
  };
}

/**
 * @param {{
 *   vendorId: string,
 *   emotion: string,
 *   intensity?: number,
 *   arkitWeights?: Record<string, number>,
 * }} state
 */
export function emotionToHumanFaceRobotBridge(state) {
  const vendorId = state.vendorId;
  const emotion = state.emotion || 'neutral';
  const intensity = Math.max(0, Math.min(1, Number(state.intensity) || 0));
  const arkit = state.arkitWeights || {};

  /** @type {Record<string, any>} */
  let face = {};
  /** @type {{ target: string, method: string, detail?: any }[]} */
  const steps = [];

  switch (vendorId) {
    case 'furhat': {
      face = emotionToFurhatBridge(emotion, intensity, arkit);
      steps.push({
        target: '/furhat/gesture',
        method: 'POST',
        detail: face.customGesture || { name: face.namedGesture },
      });
      break;
    }
    case 'qtrobot': {
      face = emotionToQtrobotFace(emotion, intensity);
      steps.push({
        target: 'robot.face',
        method: 'show_emotion',
        detail: face.showEmotion,
      });
      break;
    }
    case 'engineered_arts': {
      face = emotionToAmecaDofs(emotion, intensity, arkit);
      steps.push({
        target: 'Tritium',
        method: 'set_expression',
        detail: { preset: face.presetExpression, dofs: face.dofs },
      });
      break;
    }
    case 'hanson_robotics': {
      face = emotionToHansonFace(emotion, intensity);
      steps.push({
        target: 'HansonFace',
        method: 'set_expression',
        detail: face,
      });
      break;
    }
    case 'icub': {
      face = emotionToIcubFace(emotion, intensity);
      steps.push({ target: 'iCub', method: 'face', detail: face });
      break;
    }
    case 'soul_machines':
    case 'uneeq': {
      face = emotionToDigitalHumanFace(emotion, intensity, arkit);
      steps.push({
        target: vendorId,
        method: 'emotion_event',
        detail: face,
      });
      break;
    }
    case 'reeti':
    case 'emys':
    case 'realbotix':
    case 'promobot':
    case 'ex_robots':
    case 'ishiguro_geminoid':
    case 'embodied_moxie': {
      face = {
        sdk: vendorId,
        expression: emotion,
        intensity,
        arkitHint: arkitNonZero(arkit, 0.05),
        note: 'Partial / partner human-face bridge',
      };
      steps.push({ target: vendorId, method: 'face_intent', detail: face });
      break;
    }
    default:
      face = { note: 'not a dedicated human-face vendor id', emotion, intensity };
  }

  return {
    schema: 'amoji.humanFaceRobot.v1',
    vendorId,
    emotion,
    intensity,
    face,
    steps,
    executeHints: {
      furhatPython: 'scripts/human_face_robot_amoji_bridge.py --live-furhat IP',
      qtrobot: 'robot.face.show_emotion(...)',
      warn: 'Dry-run by default',
    },
    ts: Date.now(),
  };
}
