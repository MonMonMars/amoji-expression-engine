import { describe, expect, it } from 'vitest';
import {
  resolveMediaPipeChannel,
  mediaPipeCategoriesToArkit,
  mediaPipeResultToFrame,
  MediaPipeCaptureSession,
  arkitHudLines,
  MEDIAPIPE_CAPTURE_PROTOCOL,
} from '../engine/capture/mediapipeArkit.js';
import { bakeCaptureTake } from '../engine/capture/captureBake.js';
import { LIVELINK_PROTOCOL } from '../engine/export/liveLinkFace.js';

describe('MediaPipe channel resolve', () => {
  it('maps ARKit-identical names', () => {
    expect(resolveMediaPipeChannel('mouthSmileLeft')).toBe('mouthSmileLeft');
    expect(resolveMediaPipeChannel('jawOpen')).toBe('jawOpen');
  });

  it('drops neutral sentinel', () => {
    expect(resolveMediaPipeChannel('_neutral')).toBeNull();
    expect(resolveMediaPipeChannel('Neutral')).toBeNull();
  });
});

describe('mediaPipeCategoriesToArkit', () => {
  it('reads category arrays from Face Landmarker', () => {
    const arkit = mediaPipeCategoriesToArkit([
      { categoryName: '_neutral', score: 0.1 },
      { categoryName: 'mouthSmileLeft', score: 0.82 },
      { categoryName: 'mouthSmileRight', score: 0.77 },
      { categoryName: 'eyeSquintLeft', score: 0.4 },
      { displayName: 'jawOpen', score: 0.15 },
    ]);
    expect(arkit.mouthSmileLeft).toBeCloseTo(0.82, 2);
    expect(arkit.mouthSmileRight).toBeCloseTo(0.77, 2);
    expect(arkit.eyeSquintLeft).toBeCloseTo(0.4, 2);
    expect(arkit.jawOpen).toBeCloseTo(0.15, 2);
    expect(arkit.browInnerUp).toBe(0);
  });

  it('accepts plain record maps', () => {
    const arkit = mediaPipeCategoriesToArkit({ browDownLeft: 0.55, browDownRight: 1.2 });
    expect(arkit.browDownLeft).toBeCloseTo(0.55, 2);
    expect(arkit.browDownRight).toBe(1); // clamped
  });
});

describe('mediaPipeResultToFrame', () => {
  it('unwraps faceBlendshapes[0].categories', () => {
    const frame = mediaPipeResultToFrame(
      {
        faceBlendshapes: [
          {
            categories: [
              { categoryName: 'mouthFrownLeft', score: 0.6 },
              { categoryName: 'mouthFrownRight', score: 0.58 },
            ],
          },
        ],
      },
      { t: 0.5, frame: 15, fps: 30 },
    );
    expect(frame.protocol).toBe(LIVELINK_PROTOCOL);
    expect(frame.source).toBe(MEDIAPIPE_CAPTURE_PROTOCOL);
    expect(frame.t).toBe(0.5);
    expect(frame.blendShapes.mouthFrownLeft).toBeCloseTo(0.6, 2);
    expect(frame.meta?.compliance).toBe('passed');
  });
});

describe('MediaPipeCaptureSession', () => {
  it('records ARKit frames and exports NDJSON for bake', () => {
    const session = new MediaPipeCaptureSession({ fps: 30, subject: 'TestCam' });
    session.start('happy');
    // simulate rising smile over ~1s
    for (let i = 0; i < 36; i++) {
      const u = i / 35;
      const e = u < 0.15 ? 0 : u < 0.4 ? (u - 0.15) / 0.25 : u < 0.7 ? 1 : Math.max(0, 1 - (u - 0.7) / 0.3);
      session.pushArkit(
        {
          mouthSmileLeft: e * 0.9,
          mouthSmileRight: e * 0.85,
          eyeSquintLeft: e * 0.35,
          eyeSquintRight: e * 0.32,
        },
        { t: i / 30 },
      );
    }
    session.stop();
    expect(session.frameCount).toBe(36);
    expect(session.durationSec).toBeGreaterThan(1);

    const ndjson = session.toNDJSON();
    expect(ndjson.split('\n').length).toBe(36);
    expect(ndjson).toContain('mouthSmileLeft');

    const bake = bakeCaptureTake(session.toTake(), { emotion: 'happy', fps: 30 });
    expect(bake.envelope.valid).toBe(true);
    expect(bake.envelope.onsetSec).toBeLessThan(bake.envelope.apexSec);
    expect(Object.keys(bake.recipeFragment.happy.peak).length).toBeGreaterThan(0);
  });

  it('ignores pushes when not recording', () => {
    const session = new MediaPipeCaptureSession();
    expect(session.pushArkit({ jawOpen: 0.5 })).toBeNull();
    expect(session.frameCount).toBe(0);
  });
});

describe('arkitHudLines', () => {
  it('sorts nonzero channels', () => {
    const lines = arkitHudLines({ jawOpen: 0.1, mouthSmileLeft: 0.8, browInnerUp: 0.01 });
    expect(lines[0].startsWith('mouthSmileLeft')).toBe(true);
    expect(lines.some((l) => l.startsWith('browInnerUp'))).toBe(false);
  });
});
