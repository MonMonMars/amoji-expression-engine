import { describe, expect, it } from 'vitest';
import {
  listChassis,
  getChassis,
  calibrateRawJoints,
  resolvePackForChassis,
} from '../../engine/export/chassisCalibrate.js';
import { driveRobot, getRobotPack } from '../../engine/export/robotDriver.js';

describe('chassis pack variants', () => {
  it('lists expressive + quiet variants linked to base chassis', () => {
    const ids = listChassis().map((c) => c.id);
    expect(ids).toContain('desktop-buddy-expressive');
    expect(ids).toContain('lobby-companion-quiet');
    const expr = getChassis('desktop-buddy-expressive');
    const quiet = getChassis('lobby-companion-quiet');
    expect(expr.variantOf).toBe('desktop-buddy');
    expect(quiet.variantOf).toBe('lobby-companion');
    expect(expr.packId).toBe('face-servo-12');
    expect(quiet.packId).toBe('upper-body-companion');
  });

  it('expressive mouth gain exceeds base desktop buddy', () => {
    const base = getChassis('desktop-buddy');
    const expr = getChassis('desktop-buddy-expressive');
    expect(expr.gains.mouth).toBeGreaterThan(base.gains.mouth);
    expect(expr.gains.expression).toBeGreaterThan(base.gains.expression);
  });

  it('quiet lobby damps body vs base', () => {
    const base = getChassis('lobby-companion');
    const quiet = getChassis('lobby-companion-quiet');
    expect(quiet.gains.body).toBeLessThan(base.gains.body);
    expect(quiet.gains.mouth).toBeLessThan(base.gains.mouth);
  });

  it('driveRobot resolves pack from variant chassis', () => {
    expect(resolvePackForChassis('face-servo-12', 'lobby-companion-quiet')).toBe(
      'upper-body-companion',
    );
    const driven = driveRobot('face-servo-12', {
      emotion: 'happy',
      intensity: 0.8,
      chassisId: 'desktop-buddy-expressive',
    });
    expect(driven.packId).toBe('face-servo-12');
    expect(driven.chassisId).toBe('desktop-buddy-expressive');
    expect(Object.keys(driven.joints).length).toBeGreaterThan(0);
  });

  it('calibrateRawJoints differs between base and expressive', () => {
    const pack = getRobotPack('face-servo-12');
    const raw = { jaw: 0.8, brow_L: 0.5, mouth_corner_L: 0.6 };
    const base = calibrateRawJoints('desktop-buddy', raw, pack);
    const expr = calibrateRawJoints('desktop-buddy-expressive', raw, pack);
    expect(expr.joints.jaw).not.toBe(base.joints.jaw);
  });
});
