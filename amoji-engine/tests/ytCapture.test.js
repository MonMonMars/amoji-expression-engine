import { describe, expect, it } from 'vitest';
import {
  LM,
  landmarkBounds,
  scoreFaceQuality,
  filterCaptureFrames,
  resultsToFilteredTake,
  buildClipJob,
  YT_CAPTURE_PROTOCOL,
} from '../engine/capture/videoIngest.js';
import { bakeCaptureTake } from '../engine/capture/captureBake.js';

/** Build a synthetic frontal face landmark set (478 slots, sparse fill). */
function frontalLandmarks(scale = 0.35, yaw = 0) {
  /** @type {Array<{ x: number, y: number, z: number }>} */
  const lm = Array.from({ length: 478 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
  const cx = 0.5 + yaw * 0.05;
  const cy = 0.45;
  const w = scale;
  const h = scale * 1.15;
  // scatter oval points
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    lm[i] = {
      x: cx + Math.cos(a) * w * 0.5,
      y: cy + Math.sin(a) * h * 0.5,
      z: 0,
    };
  }
  lm[LM.leftEyeOuter] = { x: cx - w * 0.28, y: cy - h * 0.05, z: 0 };
  lm[LM.rightEyeOuter] = { x: cx + w * 0.28, y: cy - h * 0.05, z: 0 };
  lm[LM.nose] = { x: cx + yaw * w * 0.35, y: cy + h * 0.05, z: 0 };
  lm[LM.chin] = { x: cx, y: cy + h * 0.5, z: 0 };
  lm[LM.forehead] = { x: cx, y: cy - h * 0.5, z: 0 };
  lm[LM.leftMouth] = { x: cx - w * 0.15, y: cy + h * 0.22, z: 0 };
  lm[LM.rightMouth] = { x: cx + w * 0.15, y: cy + h * 0.22, z: 0 };
  return lm;
}

describe('face quality', () => {
  it('passes a large frontal face', () => {
    const q = scoreFaceQuality(frontalLandmarks(0.4, 0));
    expect(q.pass).toBe(true);
    expect(q.score).toBeGreaterThan(0.7);
    expect(landmarkBounds(frontalLandmarks(0.4)).area).toBeGreaterThan(0.05);
  });

  it('fails tiny or strong profile faces', () => {
    const tiny = scoreFaceQuality(frontalLandmarks(0.08, 0), { minArea: 0.035 });
    expect(tiny.pass).toBe(false);
    expect(tiny.reasons).toContain('face_too_small');

    const profile = scoreFaceQuality(frontalLandmarks(0.4, 3.5), { maxYaw: 0.45 });
    expect(profile.pass).toBe(false);
    expect(profile.reasons).toContain('too_profile');
  });
});

describe('filter + take', () => {
  it('drops low-quality frames and rebases time', () => {
    const frames = [
      {
        t: 1.0,
        landmarks: frontalLandmarks(0.08),
        blendShapes: { mouthSmileLeft: 0.8, mouthSmileRight: 0.8 },
      },
      {
        t: 1.2,
        landmarks: frontalLandmarks(0.4),
        blendShapes: { mouthSmileLeft: 0.9, mouthSmileRight: 0.85, eyeSquintLeft: 0.3 },
      },
      {
        t: 1.4,
        landmarks: frontalLandmarks(0.4),
        blendShapes: { mouthSmileLeft: 0.7, mouthSmileRight: 0.7 },
      },
    ];
    const filtered = filterCaptureFrames(frames, { minArea: 0.035, minQuality: 0.55 });
    expect(filtered.droppedCount).toBeGreaterThanOrEqual(1);
    expect(filtered.keptCount).toBeGreaterThanOrEqual(2);
  });

  it('resultsToFilteredTake bakes happily', () => {
    const results = [];
    for (let i = 0; i < 30; i++) {
      const u = i / 29;
      const e = u < 0.2 ? u / 0.2 : u < 0.7 ? 1 : Math.max(0, 1 - (u - 0.7) / 0.3);
      results.push({
        t: i / 24,
        faceLandmarks: [frontalLandmarks(0.4)],
        faceBlendshapes: [
          {
            categories: [
              { categoryName: 'mouthSmileLeft', score: e * 0.9 },
              { categoryName: 'mouthSmileRight', score: e * 0.85 },
              { categoryName: 'eyeSquintLeft', score: e * 0.35 },
              { categoryName: 'eyeSquintRight', score: e * 0.3 },
            ],
          },
        ],
      });
    }
    const take = resultsToFilteredTake(results, {
      emotion: 'happy',
      fps: 24,
      filter: { minQuality: 0.5 },
    });
    expect(take.protocol).toBe(YT_CAPTURE_PROTOCOL);
    expect(take.frameCount).toBeGreaterThan(10);
    expect(take.frames[0].t).toBe(0);

    const bake = bakeCaptureTake(take, { emotion: 'happy', fps: 24 });
    expect(bake.envelope.valid).toBe(true);
    expect(bake.envelope.onsetSec).toBeLessThan(bake.envelope.apexSec);
  });
});

describe('buildClipJob', () => {
  it('requires source and emotion', () => {
    expect(() => buildClipJob(/** @type {any} */ ({ source: 'x' }))).toThrow(/emotion/);
    const job = buildClipJob({
      source: 'https://www.youtube.com/watch?v=demo',
      emotion: 'sad',
      startSec: 10,
      durationSec: 5,
    });
    expect(job.protocol).toBe(YT_CAPTURE_PROTOCOL);
    expect(job.authoringOnly).toBe(true);
    expect(job.legalNote).toMatch(/likeness/i);
  });
});
