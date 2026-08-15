import { describe, expect, it } from 'vitest';
import { emotionToRobotVendorBridge } from '../engine/layers/robotVendorBridge.js';

/** Mirror Face Live fingerprint (omit ts, round floats). */
function vendorBridgeFingerprint(bridge) {
  const { ts, ...rest } = bridge;
  return JSON.stringify(rest, (_k, v) =>
    typeof v === 'number' ? Math.round(v * 100) / 100 : v,
  );
}

describe('robot bridge streaming stability', () => {
  it('fingerprints ignore ts so identical emotions do not retrigger', () => {
    const a = emotionToRobotVendorBridge({
      vendorId: 'furhat',
      emotion: 'happy',
      intensity: 0.7,
      arkitWeights: { mouthSmileLeft: 0.811 },
      streaming: true,
    });
    const b = emotionToRobotVendorBridge({
      vendorId: 'furhat',
      emotion: 'happy',
      intensity: 0.7,
      arkitWeights: { mouthSmileLeft: 0.814 },
      streaming: true,
    });
    // ts may collide within the same ms — fingerprint must still match
    expect(a.ts).toBeTypeOf('number');
    expect(vendorBridgeFingerprint(a)).toBe(vendorBridgeFingerprint(b));
    expect(vendorBridgeFingerprint(a)).not.toContain('"ts"');
  });

  it('qtrobot vendor emits show_emotion step', () => {
    const v = emotionToRobotVendorBridge({
      vendorId: 'qtrobot',
      emotion: 'surprised',
      intensity: 0.9,
    });
    expect(v.vendor.humanFace).toBe(true);
    expect(v.payload.humanFace.face.showEmotion.emotion).toBe('QT/surprise');
  });
});
