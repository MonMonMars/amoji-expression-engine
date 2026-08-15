import { describe, expect, it } from 'vitest';
import { ROBOT_VENDORS, getRobotVendor } from '../engine/layers/robotVendorCatalog.js';
import {
  emotionToRobotVendorBridge,
  emotionToSpotAv,
  emotionToPepperNaoqi,
  emotionToMistyRest,
  emotionToRos2Expressive,
} from '../engine/layers/robotVendorBridge.js';

describe('robotVendorCatalog', () => {
  it('lists major vendors including closed stubs', () => {
    const ids = ROBOT_VENDORS.map((v) => v.id);
    for (const id of [
      'unitree',
      'boston_dynamics_spot',
      'softbank_pepper',
      'misty',
      'temi',
      'figure_ai',
      'tesla_optimus',
      'ros2_expressive',
    ]) {
      expect(ids).toContain(id);
    }
    expect(getRobotVendor('misty').depth).toBe('full');
    expect(getRobotVendor('figure_ai').depth).toBe('stub');
  });
});

describe('robotVendorBridge', () => {
  it('emits unitree nested payload', () => {
    const b = emotionToRobotVendorBridge({
      vendorId: 'unitree',
      emotion: 'happy',
      intensity: 0.7,
      unitreePlatform: 'g1',
    });
    expect(b.schema).toBe('amoji.robotVendor.v1');
    expect(b.payload.unitree.schema).toBe('amoji.unitree.v1');
    expect(b.steps.length).toBeGreaterThan(0);
  });

  it('maps Spot / Pepper / Misty / ROS2', () => {
    const spot = emotionToSpotAv('angry', 1);
    expect(spot.behavior.colorPreset).toBe('danger');
    const pepper = emotionToPepperNaoqi('sad', 0.8);
    expect(pepper.leds.module).toBe('ALLeds');
    expect(pepper.animatedSpeech.animation).toMatch(/Sad/);
    const misty = emotionToMistyRest('happy', 0.6);
    expect(misty.requests[0].path).toBe('/api/led');
    expect(misty.requests.some((r) => r.path.includes('images'))).toBe(true);
    const ros = emotionToRos2Expressive('joy', 0.5, [1, 2, 3]);
    expect(ros.topics[0].name).toBe('/amoji/emotion');
  });

  it('builds vendor bridge for misty and stubs', () => {
    const misty = emotionToRobotVendorBridge({
      vendorId: 'misty',
      emotion: 'surprised',
      intensity: 0.9,
    });
    expect(misty.vendor.id).toBe('misty');
    expect(misty.payload.misty.requests.length).toBeGreaterThan(2);

    const fig = emotionToRobotVendorBridge({
      vendorId: 'figure_ai',
      emotion: 'happy',
      intensity: 0.5,
    });
    expect(fig.payload.partial.intent.emotion).toBe('happy');
  });
});
