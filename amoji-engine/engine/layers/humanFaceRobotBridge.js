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
 * Maps Apple ARKit 52 → FaceCore ARKitParams / CharParams where documented.
 * @param {Record<string, number>} arkitWeights
 * @param {{ hold?: number, name?: string, streaming?: boolean }} [opts]
 */
export function arkitWeightsToFurhatGesture(arkitWeights = {}, opts = {}) {
  const hold = opts.hold ?? 0.45;
  const streaming = !!opts.streaming;
  /** @type {Record<string, number>} */
  const params = {};

  /** @type {Record<string, string>} */
  const map = {
    browInnerUp: 'BROW_IN_LEFT',
    browDownLeft: 'BROW_DOWN_LEFT',
    browDownRight: 'BROW_DOWN_RIGHT',
    browOuterUpLeft: 'BROW_UP_LEFT',
    browOuterUpRight: 'BROW_UP_RIGHT',
    eyeBlinkLeft: 'BLINK_LEFT',
    eyeBlinkRight: 'BLINK_RIGHT',
    eyeSquintLeft: 'EYE_SQUINT_LEFT',
    eyeSquintRight: 'EYE_SQUINT_RIGHT',
    eyeWideLeft: 'SURPRISE',
    eyeWideRight: 'SURPRISE',
    eyeLookUpLeft: 'LOOK_UP',
    eyeLookUpRight: 'LOOK_UP',
    eyeLookDownLeft: 'LOOK_DOWN',
    eyeLookDownRight: 'LOOK_DOWN',
    eyeLookInLeft: 'LOOK_RIGHT',
    eyeLookInRight: 'LOOK_LEFT',
    eyeLookOutLeft: 'LOOK_LEFT',
    eyeLookOutRight: 'LOOK_RIGHT',
    jawOpen: 'PHONE_AAH',
    jawForward: 'PHONE_AAH',
    mouthClose: 'PHONE_BMP',
    mouthPucker: 'PHONE_W_OO',
    mouthFunnel: 'PHONE_W_OO',
    mouthSmileLeft: 'SMILE_CLOSED',
    mouthSmileRight: 'SMILE_CLOSED',
    mouthFrownLeft: 'EXPR_SAD',
    mouthFrownRight: 'EXPR_SAD',
    mouthUpperUpLeft: 'SMILE_OPEN',
    mouthUpperUpRight: 'SMILE_OPEN',
    mouthLowerDownLeft: 'EXPR_SAD',
    mouthLowerDownRight: 'EXPR_SAD',
    mouthPressLeft: 'EXPR_ANGER',
    mouthPressRight: 'EXPR_ANGER',
    noseSneerLeft: 'EXPR_DISGUST',
    noseSneerRight: 'EXPR_DISGUST',
    cheekSquintLeft: 'SMILE_CLOSED',
    cheekSquintRight: 'SMILE_CLOSED',
    cheekPuff: 'PHONE_BMP',
  };

  for (const [arkit, furhat] of Object.entries(map)) {
    const v = arkitWeights[arkit];
    if (v && v > 0.04) {
      params[furhat] = Math.min(1, Math.max(params[furhat] || 0, v));
    }
  }

  // Also mirror browInnerUp to both IN channels when only one mapped
  if ((arkitWeights.browInnerUp || 0) > 0.04) {
    const v = Math.min(1, arkitWeights.browInnerUp);
    params.BROW_IN_LEFT = Math.max(params.BROW_IN_LEFT || 0, v);
    params.BROW_IN_RIGHT = Math.max(params.BROW_IN_RIGHT || 0, v);
  }

  const smile =
    Math.max(arkitWeights.mouthSmileLeft || 0, arkitWeights.mouthSmileRight || 0) ||
    params.SMILE_CLOSED ||
    0;
  if (smile > 0.55) params.SMILE_OPEN = Math.max(params.SMILE_OPEN || 0, smile);
  else if (smile > 0.05) params.SMILE_CLOSED = Math.max(params.SMILE_CLOSED || 0, smile);

  const angerProxy = Math.max(
    arkitWeights.browDownLeft || 0,
    arkitWeights.browDownRight || 0,
    arkitWeights.mouthPressLeft || 0,
    arkitWeights.mouthPressRight || 0,
  );
  if (angerProxy > 0.25) params.EXPR_ANGER = Math.min(1, Math.max(params.EXPR_ANGER || 0, angerProxy));

  const fearProxy = Math.max(
    arkitWeights.eyeWideLeft || 0,
    arkitWeights.eyeWideRight || 0,
    arkitWeights.browInnerUp || 0,
  );
  if (fearProxy > 0.35 && (arkitWeights.mouthFrownLeft || 0) + (arkitWeights.mouthFrownRight || 0) > 0.2) {
    params.EXPR_FEAR = Math.min(1, fearProxy);
  }

  const sadProxy = Math.max(
    arkitWeights.mouthFrownLeft || 0,
    arkitWeights.mouthFrownRight || 0,
    params.EXPR_SAD || 0,
  );
  if (sadProxy > 0.2) params.EXPR_SAD = Math.min(1, sadProxy);

  /** @type {{ time: number[], params: Record<string, any> }[]} */
  const frames = [{ time: [hold], params }];
  if (!streaming) {
    frames.push({ time: [hold + 0.35], params: { reset: true } });
  }

  return {
    class: 'furhatos.gestures.Gesture',
    name: opts.name || 'amoji_arkit',
    frames,
  };
}

/**
 * Emotion → Furhat Remote API bundle (named + optional ARKit custom gesture).
 * @param {string} emotion
 * @param {number} intensity
 * @param {Record<string, number>} [arkitWeights]
 */
export function emotionToFurhatBridge(emotion, intensity = 0.7, arkitWeights, opts = {}) {
  const named = emotionToFurhatNamedGesture(emotion, intensity);
  const nz = arkitWeights ? arkitNonZero(arkitWeights, 0.04) : {};
  const streaming = opts.streaming !== false && Object.keys(nz).length > 0;
  const custom =
    Object.keys(nz).length > 0
      ? arkitWeightsToFurhatGesture(arkitWeights, {
          hold: streaming ? 0.12 : 0.35 + 0.4 * intensity,
          name: `amoji_${emotion}`,
          streaming,
        })
      : null;

  return {
    sdk: 'Furhat Remote API',
    baseUrlTemplate: 'http://{robot_ip}:54321',
    streaming,
    requests: [
      {
        method: 'POST',
        path: '/furhat/gesture',
        query: custom ? undefined : { name: named },
        body: custom ? { body: JSON.stringify(custom) } : undefined,
        note: custom
          ? streaming
            ? 'Streaming FaceCore gesture from ARKit (no reset frame)'
            : 'Custom FaceCore gesture from ARKit weights'
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
 *   streaming?: boolean,
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
      face = emotionToFurhatBridge(emotion, intensity, arkit, {
        streaming: state.streaming !== false,
      });
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
