import { describe, expect, it } from 'vitest';
import {
  listRobotPacks,
  getRobotPack,
  emotionToFaceHints,
  mapFrameToJoints,
  clampJoints,
  driveRobot,
  encodeRobotLine,
  RobotDriverPublisher,
  DEFAULT_ROBOT_PACK,
  ROBOT_PROTOCOL,
} from '../engine/export/robotDriver.js';
import { resolveMouth } from '../engine/layers/resolveMouth.js';
import { evaluateEmotion } from '../engine/layers/emotionFormulas.js';

describe('robot pack catalog', () => {
  it('lists three packs with increasing DOF', () => {
    const packs = listRobotPacks();
    expect(packs.map((p) => p.id)).toEqual([
      'face-servo-12',
      'upper-body-companion',
      'humanoid-stub',
    ]);
    const face = packs.find((p) => p.id === 'face-servo-12');
    const upper = packs.find((p) => p.id === 'upper-body-companion');
    const human = packs.find((p) => p.id === 'humanoid-stub');
    expect(face.dof).toBe(12);
    expect(upper.dof).toBeGreaterThan(face.dof);
    expect(human.dof).toBeGreaterThan(upper.dof);
  });

  it('inherits joints via extends chain', () => {
    const pack = getRobotPack('humanoid-stub');
    expect(pack.joints.jaw).toBeTruthy();
    expect(pack.joints.neck_pitch).toBeTruthy();
    expect(pack.joints.hip_L).toBeTruthy();
    expect(pack.dof).toBe(Object.keys(pack.joints).length);
  });

  it('defaults to face-servo-12', () => {
    expect(DEFAULT_ROBOT_PACK).toBe('face-servo-12');
    expect(getRobotPack().id).toBe('face-servo-12');
  });
});

describe('emotion → face hints', () => {
  it('happy raises mouth corners; angry pulls brows down', () => {
    const happy = emotionToFaceHints('happy', 1);
    const angry = emotionToFaceHints('angry', 1);
    expect(happy.corner).toBeGreaterThan(0.5);
    expect(angry.brow).toBeLessThan(-0.5);
  });

  it('scales with intensity', () => {
    const soft = emotionToFaceHints('surprised', 0.3);
    const full = emotionToFaceHints('surprised', 1);
    expect(Math.abs(soft.brow)).toBeLessThan(Math.abs(full.brow));
  });
});

describe('driveRobot', () => {
  it('compliance-gates output and clamps joints', () => {
    const frame = driveRobot('face-servo-12', {
      emotion: 'happy',
      intensity: 1,
      lookX: 0.4,
      lookY: -0.2,
    });
    expect(frame.meta?.compliance || frame.compliance).toBeTruthy();
    // applyComplianceGate usually sets meta.compliance
    expect(frame.kind).toBe('robot_driver');
    expect(frame.dof).toBe(12);
    expect(frame.joints.mouth_corner_L.value).toBeGreaterThan(0.4);
    expect(frame.joints.eye_pan_L.value).toBeCloseTo(0.4, 2);
    expect(frame.joints.jaw.value).toBeGreaterThanOrEqual(0);
    expect(frame.joints.jaw.value).toBeLessThanOrEqual(1);
  });

  it('MBP / rest viseme can lock jaw near closed', () => {
    const emotionParams = evaluateEmotion('happy', 1);
    const mouth = resolveMouth('MBP', emotionParams, 1);
    expect(mouth.jaw).toBe(0);
    const frame = driveRobot('face-servo-12', {
      emotion: 'happy',
      intensity: 1,
      mouth,
    });
    expect(frame.joints.jaw.value).toBe(0);
    // smile corners still allowed
    expect(frame.joints.mouth_corner_L.value).toBeGreaterThan(0);
  });

  it('upper-body maps Layer B neck/shoulder', () => {
    const sad = driveRobot('upper-body-companion', {
      emotion: 'sad',
      intensity: 1,
      timeSec: 0.5,
    });
    expect(sad.joints.neck_pitch).toBeTruthy();
    expect(sad.joints.shoulder_L_lift.value).toBeGreaterThanOrEqual(0);
    // sad typically tilts head down → negative pitch
    expect(sad.joints.neck_pitch.value).toBeLessThan(0.05);
  });

  it('humanoid walking drives opposing hips', () => {
    const a = driveRobot('humanoid-stub', {
      emotion: 'happy',
      intensity: 1,
      walking: true,
      gaitPhase: 0.25,
    });
    const b = driveRobot('humanoid-stub', {
      emotion: 'happy',
      intensity: 1,
      walking: true,
      gaitPhase: 0.75,
    });
    expect(a.walking).toBe(true);
    expect(a.joints.hip_L.value).not.toBeCloseTo(b.joints.hip_L.value, 2);
    expect(Math.sign(a.joints.hip_L.value)).not.toBe(Math.sign(a.joints.hip_R.value) || 1);
  });

  it('unknown pack errors cleanly', () => {
    const bad = driveRobot('no-such-chassis', { emotion: 'happy' });
    expect(bad.error).toBe('unknown_pack');
  });

  it('clamps beyond hardware limits', () => {
    const pack = getRobotPack('face-servo-12');
    const raw = mapFrameToJoints(pack, { emotion: 'neutral', lookX: 5, lookY: -5 });
    raw.jaw = 9;
    const joints = clampJoints(pack, raw);
    expect(joints.eye_pan_L.value).toBe(1);
    expect(joints.eye_tilt_L.value).toBe(-1);
    expect(joints.jaw.value).toBe(1);
  });
});

describe('encode + publisher', () => {
  it('encodes JSON line with protocol', () => {
    const frame = driveRobot('face-servo-12', { emotion: 'surprised', intensity: 1 });
    const line = encodeRobotLine(frame);
    const parsed = JSON.parse(line);
    expect(parsed.protocol).toBe(ROBOT_PROTOCOL);
    expect(parsed.pack).toBe('face-servo-12');
    expect(typeof parsed.joints.jaw).toBe('number');
  });

  it('publisher only flushes when enabled', () => {
    const pub = new RobotDriverPublisher('face-servo-12');
    pub.publish({ emotion: 'angry', intensity: 0.8 });
    expect(pub.flushLine()).toBe('');
    pub.enabled = true;
    const line = pub.flushLine();
    expect(line).toContain('face-servo-12');
    expect(JSON.parse(line).joints.brow_L).toBeLessThan(0);
  });
});
