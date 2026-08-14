import { describe, expect, it } from 'vitest';
import {
  SAKURA_TO_MIXAMO,
  MIXAMO_BODY_BONE_RE,
  MIXAMO_DEMO_CLIPS,
  mixamoBoneForSakura,
  mixamoRetargetOptions,
  pickMixamoClip,
} from '../engine/layers/mixamoRetarget.js';

describe('mixamoRetarget', () => {
  it('maps core Sakura bones to mixamorig*', () => {
    expect(mixamoBoneForSakura('pelvis')).toBe('mixamorigHips');
    expect(mixamoBoneForSakura('upperarm_L')).toBe('mixamorigLeftArm');
    expect(mixamoBoneForSakura('thigh_R')).toBe('mixamorigRightUpLeg');
    expect(Object.keys(SAKURA_TO_MIXAMO).length).toBeGreaterThanOrEqual(20);
  });

  it('captures full-body Mixamo bone names', () => {
    expect(MIXAMO_BODY_BONE_RE.test('pelvis')).toBe(true);
    expect(MIXAMO_BODY_BONE_RE.test('foot_L')).toBe(true);
    expect(MIXAMO_BODY_BONE_RE.test('upperarm_twist_L')).toBe(false);
  });

  it('builds SkeletonUtils options with target→source names', () => {
    const opts = mixamoRetargetOptions({ scale: 0.01 });
    expect(opts.hip).toBe('mixamorigHips');
    expect(opts.names.pelvis).toBe('mixamorigHips');
    expect(opts.scale).toBe(0.01);
  });

  it('picks the longest usable Mixamo clip', () => {
    const clip = pickMixamoClip([
      { name: 'Take 001', duration: 0, tracks: [] },
      { name: 'mixamo.com', duration: 16.8, tracks: [1, 2, 3] },
      { name: 'short', duration: 1, tracks: [1] },
    ]);
    expect(clip.name).toBe('mixamo.com');
  });

  it('lists demo clips under the character mixamo folder', () => {
    expect(MIXAMO_DEMO_CLIPS.some((c) => c.file.includes('Samba'))).toBe(true);
    expect(MIXAMO_DEMO_CLIPS.some((c) => c.file.includes('mixamo'))).toBe(true);
  });
});
