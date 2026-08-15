import { describe, expect, it } from 'vitest';
import {
  emotionToGo2Sport,
  emotionToG1ArmAction,
  emotionToG1Loco,
  emotionToUnitreeLedRgb,
  emotionToUnitreeBridge,
  unitreeBridgeSteps,
  UNITREE_GO2_SPORT_API,
  UNITREE_G1_ARM_ACTIONS,
  UNITREE_UNSAFE_SPORT,
} from '../engine/layers/unitreeBridge.js';

describe('unitreeBridge', () => {
  it('maps Go2 sport APIs from emotion', () => {
    expect(emotionToGo2Sport('happy', 0.5).method).toBe('Heart');
    expect(emotionToGo2Sport('happy', 0.5).apiId).toBe(UNITREE_GO2_SPORT_API.Heart);
    expect(emotionToGo2Sport('happy', 0.9).method).toBe('Dance1');
    expect(emotionToGo2Sport('sad', 0.8).method).toBe('Sit');
    expect(emotionToGo2Sport('angry', 1).method).toBe('StopMove');
    expect(emotionToGo2Sport('surprised', 1).method).toBe('Stretch');
  });

  it('maps G1 arm + loco', () => {
    expect(emotionToG1ArmAction('angry', 1).action).toBe('reject');
    expect(emotionToG1ArmAction('angry', 1).actionId).toBe(
      UNITREE_G1_ARM_ACTIONS.reject,
    );
    expect(emotionToG1ArmAction('happy', 0.5).action).toBe('high five');
    expect(emotionToG1Loco('sad', 1).method).toBe('LowStand');
    expect(emotionToG1Loco('happy', 0.5).method).toBe('WaveHand');
  });

  it('builds amoji.unitree.v1 with safe defaults', () => {
    const b = emotionToUnitreeBridge({ emotion: 'joy', intensity: 0.8, platform: 'g1' });
    expect(b.schema).toBe('amoji.unitree.v1');
    expect(b.safe).toBe(true);
    expect(b.g1.audio.led.rgb).toHaveLength(3);
    expect(b.go2.sport.apiId).toBeTypeOf('number');
    expect(UNITREE_UNSAFE_SPORT.has('FrontFlip')).toBe(true);
    const steps = unitreeBridgeSteps(b, 'g1');
    expect(steps.some((s) => s.target.startsWith('g1'))).toBe(true);
  });

  it('scales LED with intensity', () => {
    const dim = emotionToUnitreeLedRgb('angry', 0.1);
    const hot = emotionToUnitreeLedRgb('angry', 1);
    expect(hot[0]).toBeGreaterThan(dim[0]);
  });
});
