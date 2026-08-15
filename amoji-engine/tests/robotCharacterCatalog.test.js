import { describe, expect, it } from 'vitest';
import {
  ROBOT_CHARACTER_REFS,
  getRobotCharacterRef,
  ANDROID_FACE_ASSETS,
} from '../engine/layers/robotCharacterCatalog.js';
import {
  emotionToRobotExpressiveWeights,
  sakuraWeightsToRobotExpressive,
  emotionToGdbotFacePart,
  emotionToGobotEyes,
  emotionToAndroidRobotBridge,
} from '../engine/layers/robotEmotionDrive.js';
import { HUMAN_HEAD_REFS, getHumanHeadRef } from '../engine/layers/humanHeadCatalog.js';
import {
  buildRetargetNames,
  JOINTS_ROBOT_EXPRESSIVE,
  JOINTS_MIXAMO_COLON,
} from '../engine/layers/bodyMotionRetarget.js';

describe('robotCharacterCatalog', () => {
  it('lists CC0/RF robots plus demo NC androids', () => {
    const ids = ROBOT_CHARACTER_REFS.map((r) => r.id);
    expect(ids).toContain('robot-expressive');
    expect(ids).toContain('xbot');
    expect(ids).toContain('cesium-man');
    expect(ids).toContain('gdbot');
    expect(ids).toContain('gobot');
    expect(getRobotCharacterRef('robot-expressive')?.robotMorphs).toBe('expressive');
    expect(getRobotCharacterRef('gdbot')?.demoOnly).toBe(true);
    expect(ANDROID_FACE_ASSETS.gdbot.faces.smile).toMatch(/smile\.png$/);
  });

  it('is merged into Face Live character picker catalog', () => {
    expect(HUMAN_HEAD_REFS.some((h) => h.id === 'robot-expressive')).toBe(true);
    expect(getHumanHeadRef('xbot').robot).toBe(true);
  });
});

describe('robotEmotionDrive', () => {
  it('maps emotions onto RobotExpressive morphs', () => {
    expect(emotionToRobotExpressiveWeights('angry', 1).Angry).toBeGreaterThan(0.9);
    expect(emotionToRobotExpressiveWeights('sad', 0.5).Sad).toBeGreaterThan(0.4);
    expect(emotionToRobotExpressiveWeights('surprised', 1).Surprised).toBeGreaterThan(0.9);
    expect(emotionToRobotExpressiveWeights('neutral', 1).Angry).toBe(0);
  });

  it('remaps sakura-style weight keys', () => {
    const m = sakuraWeightsToRobotExpressive({
      Expressions_browDownLeft_max: 0.8,
      jawOpen: 0.7,
    });
    expect(m.Angry).toBeGreaterThan(0.5);
    expect(m.Surprised).toBeGreaterThan(0.5);
  });

  it('picks android face / eye panel keys', () => {
    expect(emotionToGdbotFacePart('happy')).toBe('smile');
    expect(emotionToGdbotFacePart('fear')).toBe('eye_spiral');
    expect(emotionToGobotEyes('sad')).toBe('hurt');
    expect(emotionToGobotEyes('neutral', { blink: 1 })).toBe('closed');
  });

  it('builds android robot bridge JSON', () => {
    const b = emotionToAndroidRobotBridge({
      emotion: 'happy',
      intensity: 0.8,
      robotId: 'robot-expressive',
    });
    expect(b.schema).toBe('amoji.androidRobot.v1');
    expect(b.leds.primary).toHaveLength(3);
    expect(b.face.panel).toBe('smile');
    expect(b.morphs.Surprised).toBeGreaterThan(0);
  });
});

describe('robot retarget profiles', () => {
  it('maps Mixamo → RobotExpressive and colon Mixamo hips', () => {
    const names = buildRetargetNames('robotExpressive', 'mixamo');
    expect(names.Hips).toBe('mixamorigHips');
    expect(names.UpperArmL).toBe('mixamorigLeftArm');
    expect(JOINTS_ROBOT_EXPRESSIVE.head).toBe('Head');
    expect(JOINTS_MIXAMO_COLON.pelvis).toBe('mixamorig:Hips');
  });
});
