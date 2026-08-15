/**
 * Multi-vendor emotion → robot command bridge.
 * Emits `amoji.robotVendor.v1` (plus nested vendor payloads). No network I/O.
 */

import { getRobotVendor } from './robotVendorCatalog.js';
import {
  emotionToUnitreeBridge,
  emotionToUnitreeLedRgb,
  unitreeBridgeSteps,
} from './unitreeBridge.js';
import { emotionToAndroidRobotBridge } from './robotEmotionDrive.js';
import { emotionToHumanFaceRobotBridge } from './humanFaceRobotBridge.js';

/**
 * @param {string} emotion
 * @param {number} intensity
 */
function led(emotion, intensity) {
  return emotionToUnitreeLedRgb(emotion, intensity);
}

/**
 * SoftBank NAOqi animation / LED tags (Pepper & NAO).
 * @param {string} emotion
 * @param {number} intensity
 */
export function emotionToPepperNaoqi(emotion, intensity = 0.7) {
  const e = String(emotion || 'neutral').toLowerCase();
  const i = Math.max(0, Math.min(1, Number(intensity) || 0));
  const rgb = led(emotion, intensity);

  /** @type {string} */
  let animation = 'animations/Stand/Gestures/Hey_1';
  if (e === 'happy' || e === 'joy' || e === 'laugh') {
    animation =
      i >= 0.75
        ? 'animations/Stand/Emotions/Positive/Happy_4'
        : 'animations/Stand/Emotions/Positive/Happy_1';
  } else if (e === 'sad' || e === 'sorrow' || e === 'cry') {
    animation = 'animations/Stand/Emotions/Negative/Sad_1';
  } else if (e === 'angry' || e === 'rage') {
    animation = 'animations/Stand/Emotions/Negative/Angry_1';
  } else if (e === 'surprised' || e === 'shock' || e === 'fear') {
    animation = 'animations/Stand/Emotions/Neutral/Surprise_1';
  } else if (e === 'thinking' || e === 'confused') {
    animation = 'animations/Stand/Gestures/Thinking_1';
  } else if (e.includes('hello') || e === 'wave') {
    animation = 'animations/Stand/Gestures/Hey_1';
  }

  return {
    sdk: 'NAOqi / QiSDK',
    animatedSpeech: {
      module: 'ALAnimatedSpeech',
      method: 'say',
      text: `\\rspd=${Math.round(80 + i * 40)}\\ ^start(${animation}) ^wait(${animation})`,
      animation,
    },
    leds: {
      module: 'ALLeds',
      method: 'fadeRGB',
      names: ['FaceLeds', 'ChestLeds'],
      rgbHex: `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`,
      duration: 0.4,
    },
    posture: {
      module: 'ALRobotPosture',
      method: 'goToPosture',
      posture: e === 'sad' ? 'Crouch' : 'Stand',
    },
  };
}

/**
 * Boston Dynamics Spot AudioVisual + mobility hints.
 * @param {string} emotion
 * @param {number} intensity
 */
export function emotionToSpotAv(emotion, intensity = 0.7) {
  const e = String(emotion || 'neutral').toLowerCase();
  const i = Math.max(0, Math.min(1, Number(intensity) || 0));
  const rgb = led(emotion, intensity);
  const sequenceType =
    e === 'angry' || e === 'fear' || e === 'surprised'
      ? 'blink'
      : e === 'happy' || e === 'joy'
        ? 'pulse'
        : 'solid';
  const colorPreset =
    e === 'angry' || e === 'rage'
      ? 'danger'
      : e === 'surprised' || e === 'fear'
        ? 'warning'
        : 'normal';

  return {
    sdk: 'bosdyn.client.audio_visual',
    client: 'AudioVisualClient',
    behavior: {
      name: `amoji_${e}`,
      ledSequenceType: sequenceType,
      colorPreset,
      colorRgb: rgb,
      maxBrightness: Number((0.3 + 0.5 * i).toFixed(2)),
      maxBuzzerVolume: e === 'angry' || e === 'surprised' ? Number((0.05 + 0.15 * i).toFixed(2)) : 0.05,
      runSeconds: Math.round(2 + i * 4),
    },
    mobilityHint: {
      note: 'Use RobotCommandClient only with clear lease — not auto-fired',
      sit: e === 'sad' || e === 'sorrow',
      stand: e !== 'sad',
    },
  };
}

/**
 * Misty II REST expression bundle.
 * @param {string} emotion
 * @param {number} intensity
 */
export function emotionToMistyRest(emotion, intensity = 0.7) {
  const e = String(emotion || 'neutral').toLowerCase();
  const i = Math.max(0, Math.min(1, Number(intensity) || 0));
  const rgb = led(emotion, intensity);

  const faceByEmotion = {
    happy: 'e_Joy.jpg',
    joy: 'e_Joy2.jpg',
    laugh: 'e_JoyGoofy2.jpg',
    sad: 'e_Sadness.jpg',
    sorrow: 'e_Sadness.jpg',
    cry: 'e_Grief.jpg',
    angry: 'e_Anger.jpg',
    rage: 'e_Rage.jpg',
    surprised: 'e_Surprise.jpg',
    shock: 'e_Amazement.jpg',
    fear: 'e_Fear.jpg',
    confused: 'e_Confusion.jpg',
    thinking: 'e_Contempt.jpg',
    love: 'e_Love.jpg',
    neutral: 'e_DefaultContent.jpg',
  };

  return {
    sdk: 'Misty HTTP API',
    baseUrlTemplate: 'http://{robot_ip}',
    requests: [
      {
        method: 'POST',
        path: '/api/led',
        body: { red: rgb[0], green: rgb[1], blue: rgb[2] },
      },
      {
        method: 'POST',
        path: '/api/images/display',
        body: {
          FileName: faceByEmotion[e] || faceByEmotion.neutral,
          Alpha: 1,
        },
      },
      {
        method: 'POST',
        path: '/api/arms/set',
        body: {
          LeftArmPosition: e === 'happy' || e === 'joy' ? -40 : e === 'sad' ? 45 : 0,
          RightArmPosition: e === 'happy' || e === 'joy' ? -40 : e === 'sad' ? 45 : 0,
          LeftArmVelocity: 40 + Math.round(i * 40),
          RightArmVelocity: 40 + Math.round(i * 40),
        },
      },
      {
        method: 'POST',
        path: '/api/head',
        body: {
          Pitch: e === 'sad' ? 20 : e === 'surprised' ? -15 : 0,
          Roll: 0,
          Yaw: 0,
          Velocity: 50,
        },
      },
    ],
  };
}

/**
 * temi Android SDK hints.
 * @param {string} emotion
 * @param {number} intensity
 */
export function emotionToTemi(emotion, intensity = 0.7) {
  const e = String(emotion || 'neutral').toLowerCase();
  const i = Math.max(0, Math.min(1, Number(intensity) || 0));
  return {
    sdk: 'robotemi/sdk (Android)',
    speak: {
      method: 'robot.speak',
      text:
        e === 'happy'
          ? 'I am happy to see you!'
          : e === 'sad'
            ? 'I feel a bit down.'
            : e === 'angry'
              ? 'Please give me some space.'
              : 'Hello.',
    },
    constraintBeWith: e === 'fear' || e === 'sad',
    skidJoy: e === 'happy' || e === 'joy' ? { x: 0, y: 0, smart: true } : null,
    facialStatus: e,
    volume: Math.round(3 + i * 7),
  };
}

/**
 * Generic ROS 2 expressive topics (works across many research platforms).
 * @param {string} emotion
 * @param {number} intensity
 * @param {[number, number, number]} rgb
 */
export function emotionToRos2Expressive(emotion, intensity, rgb) {
  return {
    sdk: 'ROS 2',
    topics: [
      {
        name: '/amoji/emotion',
        type: 'std_msgs/msg/String',
        data: JSON.stringify({ emotion, intensity }),
      },
      {
        name: '/amoji/led',
        type: 'std_msgs/msg/ColorRGBA',
        data: {
          r: rgb[0] / 255,
          g: rgb[1] / 255,
          b: rgb[2] / 255,
          a: intensity,
        },
      },
      {
        name: '/amoji/gesture',
        type: 'std_msgs/msg/String',
        data: emotion,
      },
    ],
  };
}

/**
 * UBTECH / CyberDog / Deep Robotics — sport-like action tags.
 * @param {string} emotion
 * @param {number} intensity
 * @param {'ubtech'|'xiaomi_cyberdog'|'deep_robotics'} kind
 */
export function emotionToSportLike(emotion, intensity, kind) {
  const e = String(emotion || 'neutral').toLowerCase();
  const i = Math.max(0, Math.min(1, Number(intensity) || 0));
  let action = 'stand';
  if (e === 'happy' || e === 'joy') action = i >= 0.8 ? 'dance' : 'hello';
  else if (e === 'sad') action = 'sit';
  else if (e === 'angry') action = 'stop';
  else if (e === 'surprised' || e === 'fear') action = 'stretch';
  else if (e.includes('hello')) action = 'hello';

  return {
    kind,
    action,
    intensity: i,
    led: led(emotion, intensity),
    note:
      kind === 'xiaomi_cyberdog'
        ? 'Publish to CyberDog motion / LED ROS2 interfaces'
        : kind === 'deep_robotics'
          ? 'Map action onto Deep Robotics sport client'
          : 'Map action onto UBTECH skill / Alpha Mini emotion API',
  };
}

/**
 * Engineered Arts / aibo / UR / stubs.
 * @param {string} vendorId
 * @param {string} emotion
 * @param {number} intensity
 */
export function emotionToPartialOrStub(vendorId, emotion, intensity) {
  const rgb = led(emotion, intensity);
  const e = String(emotion || 'neutral').toLowerCase();

  if (vendorId === 'engineered_arts') {
    return {
      sdk: 'Tritium / partner API',
      faceChannels: {
        brow_raise: e === 'surprised' || e === 'fear' ? intensity : 0,
        smile: e === 'happy' || e === 'joy' || e === 'laugh' ? intensity : 0,
        frown: e === 'sad' || e === 'angry' ? intensity : 0,
      },
      gestureClip:
        e === 'happy' ? 'wave' : e === 'sad' ? 'look_down' : e === 'angry' ? 'reject' : 'idle',
      led: rgb,
    };
  }
  if (vendorId === 'sony_aibo') {
    return {
      sdk: 'aibo Developer API',
      eyesLed: rgb,
      behavior:
        e === 'happy' ? 'happy_mode' : e === 'sad' ? 'sad_mode' : e === 'angry' ? 'angry_mode' : 'neutral',
      note: 'Requires aibo Cloud OAuth — companion must authenticate',
    };
  }
  if (vendorId === 'universal_robots') {
    return {
      sdk: 'URScript / RTDE',
      dashboard: e === 'angry' ? 'stop' : 'play',
      expressiveJointDeltaDeg: {
        note: 'Relative wrist/elbow flourish — site calibration required',
        wrist3: e === 'happy' ? 15 * intensity : e === 'sad' ? -10 * intensity : 0,
      },
    };
  }
  if (vendorId === 'pal_robotics') {
    return {
      sdk: 'ROS play_motion',
      playMotion:
        e === 'happy'
          ? 'wave'
          : e === 'sad'
            ? 'bow'
            : e === 'surprised'
              ? 'show_face'
              : 'home',
      ros2: emotionToRos2Expressive(emotion, intensity, rgb),
    };
  }
  if (vendorId === 'robotis') {
    return {
      sdk: 'ROS OP3 action module',
      op3Action: e === 'happy' ? 'win' : e === 'sad' ? 'lose' : e === 'angry' ? 'attack' : 'stand',
      turtlebotLed: rgb,
      ros2: emotionToRos2Expressive(emotion, intensity, rgb),
    };
  }
  if (vendorId === 'anybotics') {
    return {
      sdk: 'ANYmal ROS2 customer API',
      gaitHint: e === 'fear' || e === 'angry' ? 'careful' : 'standard',
      statusLight: rgb,
      ros2: emotionToRos2Expressive(emotion, intensity, rgb),
    };
  }
  // closed / partner stubs
  return {
    sdk: 'none_public',
    intent: { emotion: e, intensity, led: rgb },
    note: 'No public SDK — keep as future partner bridge intent',
  };
}

/**
 * @param {{
 *   vendorId?: string,
 *   emotion: string,
 *   intensity?: number,
 *   unitreePlatform?: import('./unitreeBridge.js').UnitreePlatform,
 *   allowUnsafe?: boolean,
 *   ttsText?: string | null,
 *   arkitWeights?: Record<string, number>,
 * }} state
 */
export function emotionToRobotVendorBridge(state) {
  const vendorId = state.vendorId || 'unitree';
  const vendor = getRobotVendor(vendorId);
  const emotion = state.emotion || 'neutral';
  const intensity = Math.max(0, Math.min(1, Number(state.intensity) || 0));
  const rgb = led(emotion, intensity);

  /** @type {Record<string, any>} */
  let payload = {};
  /** @type {{ target: string, method: string, detail?: any }[]} */
  let steps = [];

  // Dedicated human-face robots (Furhat ARKit, Ameca DOF, QTrobot, …)
  if (vendor.humanFace && !['softbank_pepper', 'misty'].includes(vendorId)) {
    const faceBridge = emotionToHumanFaceRobotBridge({
      vendorId,
      emotion,
      intensity,
      arkitWeights: state.arkitWeights,
    });
    payload = { humanFace: faceBridge };
    steps = faceBridge.steps || [];
  } else switch (vendorId) {
    case 'unitree': {
      const u = emotionToUnitreeBridge({
        emotion,
        intensity,
        platform: state.unitreePlatform || 'auto',
        allowUnsafe: state.allowUnsafe,
        ttsText: state.ttsText,
      });
      payload = { unitree: u };
      steps = unitreeBridgeSteps(u, state.unitreePlatform || 'auto').map((s) => ({
        target: s.target,
        method: s.method,
        detail: s.detail,
      }));
      break;
    }
    case 'boston_dynamics_spot': {
      const spot = emotionToSpotAv(emotion, intensity);
      payload = { spot };
      steps = [
        { target: 'AudioVisualClient', method: 'run_behavior', detail: spot.behavior },
      ];
      break;
    }
    case 'softbank_pepper':
    case 'softbank_nao': {
      const naoqi = emotionToPepperNaoqi(emotion, intensity);
      payload = { naoqi, robot: vendorId === 'softbank_nao' ? 'NAO' : 'Pepper' };
      if (vendorId === 'softbank_pepper') {
        payload.humanFace = emotionToHumanFaceRobotBridge({
          vendorId: 'softbank_pepper',
          emotion,
          intensity,
          arkitWeights: state.arkitWeights,
        });
      }
      steps = [
        { target: 'ALAnimatedSpeech', method: 'say', detail: naoqi.animatedSpeech },
        { target: 'ALLeds', method: 'fadeRGB', detail: naoqi.leds },
      ];
      break;
    }
    case 'misty': {
      const misty = emotionToMistyRest(emotion, intensity);
      payload = {
        misty,
        humanFace: emotionToHumanFaceRobotBridge({
          vendorId: 'misty',
          emotion,
          intensity,
          arkitWeights: state.arkitWeights,
        }),
      };
      steps = misty.requests.map((r) => ({
        target: r.path,
        method: r.method,
        detail: r.body,
      }));
      break;
    }
    case 'temi': {
      const temi = emotionToTemi(emotion, intensity);
      payload = { temi };
      steps = [{ target: 'Robot', method: 'speak', detail: temi.speak }];
      break;
    }
    case 'xiaomi_cyberdog':
    case 'ubtech':
    case 'deep_robotics': {
      const sport = emotionToSportLike(emotion, intensity, vendorId);
      payload = { sportLike: sport };
      steps = [{ target: vendorId, method: sport.action, detail: sport }];
      break;
    }
    case 'ros2_expressive': {
      const ros2 = emotionToRos2Expressive(emotion, intensity, rgb);
      payload = { ros2 };
      steps = ros2.topics.map((t) => ({
        target: t.name,
        method: 'publish',
        detail: t,
      }));
      break;
    }
    default: {
      const partial = emotionToPartialOrStub(vendorId, emotion, intensity);
      payload = { partial };
      steps = [{ target: vendorId, method: 'intent', detail: partial }];
      break;
    }
  }

  return {
    schema: 'amoji.robotVendor.v1',
    vendor: {
      id: vendor.id,
      label: vendor.label,
      company: vendor.company,
      depth: vendor.depth,
      sdk: vendor.sdk,
      docs: vendor.docs,
      humanFace: !!vendor.humanFace,
      faceDrive: vendor.faceDrive || null,
    },
    emotion,
    intensity,
    led: rgb,
    androidCompat: emotionToAndroidRobotBridge({ emotion, intensity, robotId: vendorId }),
    payload,
    steps,
    executeHints: {
      python: 'scripts/robot_vendor_amoji_bridge.py',
      facePython: 'scripts/human_face_robot_amoji_bridge.py',
      unitreePython: 'scripts/unitree_amoji_bridge.py',
      warn: 'Dry-run by default — live dispatch only on vendor SDK hosts',
    },
    ts: Date.now(),
  };
}
