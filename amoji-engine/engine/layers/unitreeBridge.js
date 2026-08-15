/**
 * Unitree robot bridge — map Amoji emotion / intensity onto
 * unitree_sdk2 / unitree_sdk2_python high-level APIs (Go2 Sport, G1 Loco/Arm/Audio, VUI).
 *
 * No DDS I/O here: Face Live emits `amoji.unitree.v1` JSON; a companion
 * (see `scripts/unitree_amoji_bridge.py`) executes on the robot network.
 *
 * References:
 * - https://github.com/unitreerobotics/unitree_sdk2_python
 * - https://github.com/unitreerobotics/unitree_sdk2
 * - https://www.unitree.com/opensource
 */

/** @typedef {'go2'|'g1'|'h1'|'b2'|'auto'} UnitreePlatform */

/** Go2 SportClient API ids (unitree_sdk2py.go2.sport.sport_api). */
export const UNITREE_GO2_SPORT_API = Object.freeze({
  Damp: 1001,
  BalanceStand: 1002,
  StopMove: 1003,
  StandUp: 1004,
  StandDown: 1005,
  RecoveryStand: 1006,
  Move: 1008,
  Sit: 1009,
  RiseSit: 1010,
  Hello: 1016,
  Stretch: 1017,
  Content: 1020,
  Dance1: 1022,
  Dance2: 1023,
  Pose: 1028,
  Scrape: 1029,
  FrontFlip: 1030,
  FrontJump: 1031,
  FrontPounce: 1032,
  Heart: 1036,
  LeftFlip: 2041,
  BackFlip: 2043,
  HandStand: 2044,
});

/** G1 ArmActionClient action_map (unitree_sdk2py.g1.arm). */
export const UNITREE_G1_ARM_ACTIONS = Object.freeze({
  'release arm': 99,
  'two-hand kiss': 11,
  'left kiss': 12,
  'right kiss': 13,
  'hands up': 15,
  clap: 17,
  'high five': 18,
  hug: 19,
  heart: 20,
  'right heart': 21,
  reject: 22,
  'right hand up': 23,
  'x-ray': 24,
  'face wave': 25,
  'high wave': 26,
  'shake hand': 27,
});

/** VUI service API ids (Go2/B2 light + volume). */
export const UNITREE_VUI_API = Object.freeze({
  SetSwitch: 1001,
  GetSwitch: 1002,
  SetVolume: 1003,
  GetVolume: 1004,
  SetBrightness: 1005,
  GetBrightness: 1006,
});

/** G1 AudioClient API ids. */
export const UNITREE_G1_AUDIO_API = Object.freeze({
  Tts: 1001,
  SetVolume: 1006,
  SetRgbLed: 1010,
});

/** Actions that must never be auto-fired from emotion without allowUnsafe. */
export const UNITREE_UNSAFE_SPORT = new Set([
  'FrontFlip',
  'FrontJump',
  'FrontPounce',
  'LeftFlip',
  'BackFlip',
  'HandStand',
]);

/**
 * Emotion → soft RGB (0–255) for G1 AudioClient.LedControl.
 * @param {string} emotion
 * @param {number} intensity 0..1
 * @returns {[number, number, number]}
 */
export function emotionToUnitreeLedRgb(emotion, intensity = 0.7) {
  const i = Math.max(0, Math.min(1, Number(intensity) || 0));
  const table = {
    happy: [40, 220, 120],
    joy: [30, 240, 140],
    laugh: [80, 255, 180],
    smile_open: [50, 210, 130],
    angry: [255, 40, 30],
    rage: [255, 20, 10],
    annoyed: [230, 80, 40],
    sad: [50, 80, 220],
    sorrow: [40, 60, 200],
    cry: [70, 90, 255],
    fear: [180, 70, 255],
    scared: [200, 60, 240],
    surprised: [255, 220, 40],
    shock: [255, 240, 60],
    confused: [180, 160, 80],
    thinking: [100, 140, 180],
    love: [255, 60, 140],
    neutral: [110, 130, 150],
  };
  const e = String(emotion || 'neutral').toLowerCase();
  const base = table[e] || table.neutral;
  const mix = 0.25 + 0.75 * i;
  return base.map((c) => Math.round(c * mix + 20 * (1 - mix)));
}

/**
 * @param {string} emotion
 * @param {number} intensity
 * @returns {{ method: string, apiId: number, args?: any[], note?: string }}
 */
export function emotionToGo2Sport(emotion, intensity = 0.7) {
  const e = String(emotion || 'neutral').toLowerCase();
  const i = Math.max(0, Math.min(1, Number(intensity) || 0));

  if (e === 'neutral' || e === 'idle') {
    return { method: 'BalanceStand', apiId: UNITREE_GO2_SPORT_API.BalanceStand };
  }
  if (e === 'happy' || e === 'joy' || e === 'love') {
    if (i >= 0.85) {
      return { method: 'Dance1', apiId: UNITREE_GO2_SPORT_API.Dance1, note: 'high joy' };
    }
    return { method: 'Heart', apiId: UNITREE_GO2_SPORT_API.Heart };
  }
  if (e === 'laugh' || e === 'smile_open') {
    return i >= 0.7
      ? { method: 'Dance2', apiId: UNITREE_GO2_SPORT_API.Dance2 }
      : { method: 'Content', apiId: UNITREE_GO2_SPORT_API.Content };
  }
  if (e === 'sad' || e === 'sorrow' || e === 'cry') {
    return i >= 0.6
      ? { method: 'Sit', apiId: UNITREE_GO2_SPORT_API.Sit }
      : { method: 'Scrape', apiId: UNITREE_GO2_SPORT_API.Scrape };
  }
  if (e === 'surprised' || e === 'shock' || e === 'fear' || e === 'scared') {
    return { method: 'Stretch', apiId: UNITREE_GO2_SPORT_API.Stretch };
  }
  if (e === 'angry' || e === 'rage' || e === 'annoyed') {
    return { method: 'StopMove', apiId: UNITREE_GO2_SPORT_API.StopMove, note: 'safe halt' };
  }
  if (e === 'confused' || e === 'thinking') {
    return { method: 'Stretch', apiId: UNITREE_GO2_SPORT_API.Stretch };
  }
  // greeting / hello family
  if (e.includes('hello') || e === 'wave' || e === 'greeting') {
    return { method: 'Hello', apiId: UNITREE_GO2_SPORT_API.Hello };
  }
  return { method: 'Hello', apiId: UNITREE_GO2_SPORT_API.Hello };
}

/**
 * @param {string} emotion
 * @param {number} intensity
 */
export function emotionToG1Loco(emotion, intensity = 0.7) {
  const e = String(emotion || 'neutral').toLowerCase();
  const i = Math.max(0, Math.min(1, Number(intensity) || 0));

  if (e === 'neutral' || e === 'idle') {
    return { method: 'BalanceStand', args: [0], note: 'balance_mode 0' };
  }
  if (e === 'sad' || e === 'sorrow' || e === 'cry') {
    return { method: 'LowStand', args: [] };
  }
  if (e === 'surprised' || e === 'shock' || e === 'fear') {
    return { method: 'HighStand', args: [] };
  }
  if (e === 'happy' || e === 'joy' || e === 'laugh' || e === 'smile_open') {
    return { method: 'WaveHand', args: [i >= 0.75] };
  }
  if (e.includes('hello') || e === 'wave' || e === 'greeting') {
    return { method: 'ShakeHand', args: [] };
  }
  if (e === 'angry' || e === 'rage') {
    return { method: 'StopMove', args: [], note: 'via velocity 0 — companion maps Stop' };
  }
  return { method: 'WaveHand', args: [false] };
}

/**
 * @param {string} emotion
 * @param {number} intensity
 */
export function emotionToG1ArmAction(emotion, intensity = 0.7) {
  const e = String(emotion || 'neutral').toLowerCase();
  const i = Math.max(0, Math.min(1, Number(intensity) || 0));

  /** @type {keyof typeof UNITREE_G1_ARM_ACTIONS} */
  let action = 'face wave';
  if (e === 'happy' || e === 'joy') action = i >= 0.8 ? 'clap' : 'high five';
  else if (e === 'laugh' || e === 'smile_open') action = 'clap';
  else if (e === 'love' || (e === 'happy' && i >= 0.9)) action = 'heart';
  else if (e === 'sad' || e === 'sorrow') action = 'release arm';
  else if (e === 'angry' || e === 'rage' || e === 'annoyed' || e === 'contempt') {
    action = 'reject';
  } else if (e === 'surprised' || e === 'shock') action = 'hands up';
  else if (e === 'fear' || e === 'scared') action = 'hands up';
  else if (e.includes('hello') || e === 'wave' || e === 'greeting') action = 'shake hand';
  else if (e === 'hug' || e === 'affection') action = 'hug';
  else if (e === 'thinking' || e === 'confused') action = 'face wave';

  const actionId = UNITREE_G1_ARM_ACTIONS[action];
  return {
    method: 'ExecuteAction',
    action,
    actionId,
    service: 'arm',
    apiId: 7106,
  };
}

/**
 * Build companion-ready Unitree command bundle.
 *
 * @param {{
 *   emotion: string,
 *   intensity?: number,
 *   platform?: UnitreePlatform,
 *   allowUnsafe?: boolean,
 *   ttsText?: string | null,
 *   blink?: number,
 * }} state
 */
export function emotionToUnitreeBridge(state) {
  const emotion = state.emotion || 'neutral';
  const intensity = Math.max(0, Math.min(1, Number(state.intensity) || 0));
  const platform = state.platform || 'auto';
  const allowUnsafe = !!state.allowUnsafe;

  const go2Sport = emotionToGo2Sport(emotion, intensity);
  if (!allowUnsafe && UNITREE_UNSAFE_SPORT.has(go2Sport.method)) {
    go2Sport.method = 'BalanceStand';
    go2Sport.apiId = UNITREE_GO2_SPORT_API.BalanceStand;
    go2Sport.note = 'unsafe sport blocked';
  }

  const led = emotionToUnitreeLedRgb(emotion, intensity);
  const brightness = Math.max(0, Math.min(10, Math.round(intensity * 10)));
  const volume = Math.max(0, Math.min(10, Math.round(3 + intensity * 7)));
  const g1Volume = Math.max(0, Math.min(100, Math.round(40 + intensity * 55)));

  const arm = emotionToG1ArmAction(emotion, intensity);
  const loco = emotionToG1Loco(emotion, intensity);

  return {
    schema: 'amoji.unitree.v1',
    platform,
    emotion,
    intensity,
    safe: !allowUnsafe,
    go2: {
      service: 'sport',
      sport: go2Sport,
      vui: {
        service: 'vui',
        brightness: { method: 'SetBrightness', apiId: UNITREE_VUI_API.SetBrightness, level: brightness },
        volume: { method: 'SetVolume', apiId: UNITREE_VUI_API.SetVolume, level: volume },
      },
    },
    g1: {
      loco: {
        service: 'sport',
        ...loco,
      },
      arm,
      audio: {
        service: 'voice',
        led: {
          method: 'LedControl',
          apiId: UNITREE_G1_AUDIO_API.SetRgbLed,
          rgb: led,
        },
        volume: {
          method: 'SetVolume',
          apiId: UNITREE_G1_AUDIO_API.SetVolume,
          level: g1Volume,
        },
        tts:
          state.ttsText != null
            ? {
                method: 'TtsMaker',
                apiId: UNITREE_G1_AUDIO_API.Tts,
                text: state.ttsText,
                speakerId: 0,
              }
            : null,
      },
    },
    h1: {
      note: 'H1 uses LocoClient-compatible high-level APIs (see unitree_sdk2_python example/h1)',
      loco,
    },
    dds: {
      sportRequest: '/api/sport/request',
      armRequest: 'arm service ExecuteAction',
      lowcmd: 'rt/lowcmd',
      lowstate: 'rt/lowstate',
      namespaces: {
        go2: 'unitree_go',
        g1: 'unitree_hg',
      },
    },
    executeHints: {
      python: 'scripts/unitree_amoji_bridge.py',
      sdk: 'unitree_sdk2_python',
      warn: 'Clear workspace; never enable allowUnsafe near people',
    },
    ts: Date.now(),
  };
}

/**
 * Flatten bridge into ordered dry-run steps for a chosen platform.
 * @param {ReturnType<typeof emotionToUnitreeBridge>} bridge
 * @param {UnitreePlatform} [platform]
 */
export function unitreeBridgeSteps(bridge, platform = 'auto') {
  const p = platform === 'auto' ? bridge.platform : platform;
  /** @type {{ target: string, method: string, detail: object }[]} */
  const steps = [];

  if (p === 'go2' || p === 'b2' || p === 'auto') {
    steps.push({ target: 'go2.sport', method: bridge.go2.sport.method, detail: bridge.go2.sport });
    steps.push({
      target: 'go2.vui',
      method: 'SetBrightness',
      detail: bridge.go2.vui.brightness,
    });
  }
  if (p === 'g1' || p === 'auto') {
    steps.push({ target: 'g1.loco', method: bridge.g1.loco.method, detail: bridge.g1.loco });
    steps.push({ target: 'g1.arm', method: bridge.g1.arm.action, detail: bridge.g1.arm });
    steps.push({ target: 'g1.audio.led', method: 'LedControl', detail: bridge.g1.audio.led });
    if (bridge.g1.audio.tts) {
      steps.push({ target: 'g1.audio.tts', method: 'TtsMaker', detail: bridge.g1.audio.tts });
    }
  }
  if (p === 'h1') {
    steps.push({ target: 'h1.loco', method: bridge.h1.loco.method, detail: bridge.h1.loco });
  }
  return steps;
}
