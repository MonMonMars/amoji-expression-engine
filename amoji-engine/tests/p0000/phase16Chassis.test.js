import { describe, expect, it } from 'vitest';
import {
  listChassis,
  getChassis,
  applyDeadzone,
  calibrateJointValue,
  calibrateRawJoints,
  ChassisSlewLimiter,
  DEFAULT_CHASSIS,
} from '../../engine/export/chassisCalibrate.js';
import {
  driveRobot,
  getRobotPack,
  RobotDriverPublisher,
} from '../../engine/export/robotDriver.js';

describe('chassis catalog', () => {
  it('lists chassis bound to packs including variants', () => {
    const list = listChassis();
    const ids = list.map((c) => c.id);
    expect(ids).toContain('desktop-buddy');
    expect(ids).toContain('lobby-companion');
    expect(ids).toContain('lab-humanoid');
    expect(ids).toContain('desktop-buddy-expressive');
    expect(ids).toContain('lobby-companion-quiet');
    expect(getChassis('lobby-companion').packId).toBe('upper-body-companion');
    expect(DEFAULT_CHASSIS).toBe('desktop-buddy');
  });
});

describe('calibration math', () => {
  it('applies deadzone around rest', () => {
    expect(applyDeadzone(0.02, 0.05, 0)).toBe(0);
    expect(applyDeadzone(0.1, 0.05, 0)).toBeCloseTo(0.05, 5);
  });

  it('scales, offsets, and inverts', () => {
    const spec = { rest: 0, min: -1, max: 1, region: 'eye' };
    expect(calibrateJointValue(0.5, spec, { scale: 0.5 })).toBeCloseTo(0.25, 5);
    expect(calibrateJointValue(0.5, spec, { invert: true })).toBeCloseTo(-0.5, 5);
    expect(calibrateJointValue(0.2, spec, { offset: 0.1 })).toBeCloseTo(0.3, 5);
  });

  it('desktop-buddy softens smile vs uncalibrated pack', () => {
    const pack = getRobotPack('face-servo-12');
    const plain = driveRobot('face-servo-12', { emotion: 'happy', intensity: 1 });
    const tuned = driveRobot('face-servo-12', {
      emotion: 'happy',
      intensity: 1,
      chassisId: 'desktop-buddy',
    });
    expect(tuned.chassisId).toBe('desktop-buddy');
    expect(tuned.joints.mouth_corner_L.value).toBeLessThan(
      plain.joints.mouth_corner_L.value,
    );
  });

  it('chassis selects pack when pack id ignored', () => {
    const frame = driveRobot('face-servo-12', {
      emotion: 'sad',
      intensity: 1,
      chassisId: 'lobby-companion',
    });
    expect(frame.packId).toBe('upper-body-companion');
    expect(frame.joints.neck_pitch).toBeTruthy();
  });
});

describe('ChassisSlewLimiter', () => {
  it('limits maxDeltaPerSec on jaw', () => {
    const slew = new ChassisSlewLimiter('desktop-buddy');
    const pack = getRobotPack('face-servo-12');
    // jump jaw 0 → 1 in one 30fps frame — should be capped ~2.5/30
    slew.step({ jaw: { value: 0, min: 0, max: 1 } }, 1 / 30);
    const next = slew.step({ jaw: { value: 1, min: 0, max: 1 } }, 1 / 30);
    expect(next.jaw).toBeLessThan(0.2);
    expect(next.jaw).toBeGreaterThan(0.05);
    expect(pack.joints.jaw.maxDeltaPerSec).toBeUndefined();
  });

  it('publisher includes chassis in JSON line', () => {
    const pub = new RobotDriverPublisher('face-servo-12', {
      chassisId: 'desktop-buddy',
      slew: false,
    });
    pub.enabled = true;
    pub.publish({ emotion: 'surprised', intensity: 1, timeSec: 0.1 });
    const line = JSON.parse(pub.flushLine());
    expect(line.chassis).toBe('desktop-buddy');
    expect(line.pack).toBe('face-servo-12');
  });
});

describe('calibrateRawJoints', () => {
  it('errors without pack', () => {
    const out = calibrateRawJoints('desktop-buddy', { jaw: 0.5 }, null);
    expect(out.error).toBe('pack_required');
  });
});
