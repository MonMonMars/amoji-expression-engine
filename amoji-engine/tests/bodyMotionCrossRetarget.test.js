import { describe, expect, it } from 'vitest';
import {
  buildRetargetNames,
  detectBodySkeletonProfile,
  bodyProfileHip,
} from '../engine/layers/bodyMotionRetarget.js';

describe('cross-skeleton body retarget', () => {
  it('maps mannequin ← Quaternius UAL (idle/walk source)', () => {
    const names = buildRetargetNames('mannequin', 'quaternius');
    expect(names.pelvis).toBe('DEF-hips');
    expect(names.upperarm_l).toBe('DEF-upper_arm.L');
    expect(names.thigh_r).toBe('DEF-thigh.R');
    expect(names.Head).toBe('DEF-head');
  });

  it('maps MPFB mixamoPlain ← CMU walk', () => {
    const names = buildRetargetNames('mixamoPlain', 'cmu');
    expect(names.Hips).toBe('Hips');
    expect(names.LeftArm).toBe('LeftArm');
    expect(names.LeftUpLeg).toBe('LeftUpLeg');
  });

  it('maps Sakura ← Mixamo (legacy)', () => {
    const names = buildRetargetNames('sakura', 'mixamo');
    expect(names.pelvis).toBe('mixamorigHips');
    expect(names.upperarm_L).toBe('mixamorigLeftArm');
  });

  it('detects mannequin vs mixamoPlain from bone name sets', () => {
    const mannequin = {
      traverse() {},
      skeleton: {
        bones: [{ name: 'pelvis' }, { name: 'upperarm_l' }, { name: 'thigh_l' }],
      },
    };
    // findSkinnedMesh looks for isSkinnedMesh
    const fakeMan = {
      traverse(fn) {
        fn({ isSkinnedMesh: true, skeleton: mannequin.skeleton, isMesh: true });
      },
    };
    expect(detectBodySkeletonProfile(fakeMan)).toBe('mannequin');

    const fakeMpfb = {
      traverse(fn) {
        fn({
          isSkinnedMesh: true,
          skeleton: {
            bones: [{ name: 'Hips' }, { name: 'LeftArm' }, { name: 'LeftUpLeg' }],
          },
          isMesh: true,
        });
      },
    };
    expect(detectBodySkeletonProfile(fakeMpfb)).toBe('mixamoPlain');
  });

  it('exposes hip bone names per profile', () => {
    expect(bodyProfileHip('mannequin')).toBe('pelvis');
    expect(bodyProfileHip('mixamoPlain')).toBe('Hips');
    expect(bodyProfileHip('quaternius')).toBe('DEF-hips');
  });
});
