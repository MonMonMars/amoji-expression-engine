import { describe, expect, it } from 'vitest';
import {
  HUMAN_FACE_ROBOT_VENDORS,
  getHumanFaceRobotVendor,
} from '../engine/layers/humanFaceRobotCatalog.js';
import {
  emotionToFurhatNamedGesture,
  arkitWeightsToFurhatGesture,
  emotionToFurhatBridge,
  emotionToQtrobotFace,
  emotionToAmecaDofs,
  emotionToHumanFaceRobotBridge,
} from '../engine/layers/humanFaceRobotBridge.js';
import { ROBOT_VENDORS, listHumanFaceVendors } from '../engine/layers/robotVendorCatalog.js';
import { emotionToRobotVendorBridge } from '../engine/layers/robotVendorBridge.js';

describe('humanFaceRobotCatalog', () => {
  it('lists Furhat Ameca QTrobot Hanson and merges into vendor picker', () => {
    const ids = HUMAN_FACE_ROBOT_VENDORS.map((v) => v.id);
    expect(ids).toContain('furhat');
    expect(ids).toContain('engineered_arts');
    expect(ids).toContain('qtrobot');
    expect(ids).toContain('hanson_robotics');
    expect(getHumanFaceRobotVendor('furhat')?.faceDrive).toBe('arkit');
    expect(ROBOT_VENDORS[0].humanFace).toBe(true);
    expect(listHumanFaceVendors().length).toBeGreaterThan(8);
  });
});

describe('humanFaceRobotBridge', () => {
  it('maps Furhat named + ARKit custom gestures', () => {
    expect(emotionToFurhatNamedGesture('angry', 1)).toMatch(/Anger|Express/);
    const g = arkitWeightsToFurhatGesture({
      mouthSmileLeft: 0.8,
      mouthSmileRight: 0.8,
      jawOpen: 0.4,
      eyeLookUpLeft: 0.5,
      noseSneerLeft: 0.4,
    });
    expect(g.class).toBe('furhatos.gestures.Gesture');
    expect(g.frames[0].params.SMILE_OPEN || g.frames[0].params.SMILE_CLOSED).toBeTruthy();
    expect(g.frames[0].params.LOOK_UP).toBeGreaterThan(0.4);
    expect(g.frames.length).toBe(2); // includes reset
    const stream = arkitWeightsToFurhatGesture({ mouthSmileLeft: 0.9 }, { streaming: true });
    expect(stream.frames.length).toBe(1);
    const b = emotionToFurhatBridge('happy', 0.7, { mouthSmileLeft: 0.9 });
    expect(b.customGesture).toBeTruthy();
    expect(b.streaming).toBe(true);
    expect(b.requests[0].path).toBe('/furhat/gesture');
  });

  it('maps QTrobot and Ameca', () => {
    expect(emotionToQtrobotFace('sad', 0.5).showEmotion.emotion).toBe('QT/sad');
    const ameca = emotionToAmecaDofs('surprised', 1, { browInnerUp: 0.9 });
    expect(ameca.presetExpression).toBe('Surprised');
    expect(ameca.dofs.brow_inner_up).toBeGreaterThan(0.5);
  });

  it('vendor bridge routes Furhat with ARKit', () => {
    const v = emotionToRobotVendorBridge({
      vendorId: 'furhat',
      emotion: 'sad',
      intensity: 0.8,
      arkitWeights: { mouthFrownLeft: 0.7, browDownLeft: 0.5 },
    });
    expect(v.vendor.humanFace).toBe(true);
    expect(v.payload.humanFace.schema).toBe('amoji.humanFaceRobot.v1');
    expect(v.steps.length).toBeGreaterThan(0);
  });
});
