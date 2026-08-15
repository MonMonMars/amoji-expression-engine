import { describe, expect, it } from 'vitest';
import {
  BODY_MOTION_CLIPS,
  BODY_MOTION_LIBRARY_NOTES,
  getBodyMotionClip,
  bodyMotionClipsBySource,
} from '../engine/layers/bodyMotionCatalog.js';
import {
  SAKURA_TO_CMU,
  SAKURA_TO_QUATERNIUS,
  bodyMotionRetargetOptions,
  pickBodyMotionClip,
  boneMapForProfile,
} from '../engine/layers/bodyMotionRetarget.js';

describe('bodyMotionCatalog', () => {
  it('ships Mixamo + CMU + Quaternius commercial-OK clips', () => {
    const sources = new Set(BODY_MOTION_CLIPS.map((c) => c.source));
    expect(sources.has('mixamo')).toBe(true);
    expect(sources.has('cmu')).toBe(true);
    expect(sources.has('quaternius')).toBe(true);
    expect(BODY_MOTION_CLIPS.length).toBeGreaterThanOrEqual(8);
  });

  it('marks Bandai as excluded NC in library notes', () => {
    const bandai = BODY_MOTION_LIBRARY_NOTES.find((n) => /Bandai/i.test(n.name));
    expect(bandai?.status).toMatch(/excluded/i);
    expect(bandai?.license).toMatch(/NC/i);
  });

  it('groups clips by source for the Face Live picker', () => {
    const groups = bodyMotionClipsBySource();
    expect(groups.some((g) => g.source === 'quaternius' && g.clips.length >= 3)).toBe(true);
    expect(getBodyMotionClip('q-walk')?.animationName).toBe('Walk_Loop');
  });
});

describe('bodyMotionRetarget', () => {
  it('maps Sakura → CMU and Quaternius hips', () => {
    expect(SAKURA_TO_CMU.pelvis).toBe('Hips');
    expect(SAKURA_TO_CMU.thigh_L).toBe('LeftUpLeg');
    expect(SAKURA_TO_QUATERNIUS.pelvis).toBe('DEF-hips');
    expect(SAKURA_TO_QUATERNIUS.upperarm_R).toBe('DEF-upper_arm.R');
  });

  it('builds retarget options per profile', () => {
    expect(bodyMotionRetargetOptions('cmu').hip).toBe('Hips');
    expect(bodyMotionRetargetOptions('quaternius').names.head).toBe('DEF-head');
    expect(boneMapForProfile('mixamo').pelvis).toBe('mixamorigHips');
  });

  it('picks preferred Quaternius clip names', () => {
    const clip = pickBodyMotionClip(
      [
        { name: 'Idle_Loop', duration: 2, tracks: [1] },
        { name: 'Walk_Loop', duration: 1.2, tracks: [1, 2] },
      ],
      'Walk_Loop',
    );
    expect(clip.name).toBe('Walk_Loop');
  });
});
