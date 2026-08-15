import { describe, expect, it } from 'vitest';
import {
  arkitNameAlias,
  remapArkitWeightsToMorphNames,
  sakuraMorphsToArkitMeshWeights,
} from '../engine/export/arkitExporter.js';

describe('arkit mesh remap for OSS heads', () => {
  it('aliases Apple ↔ facecap underscore names', () => {
    expect(arkitNameAlias('eyeBlinkLeft')).toBe('eyeBlink_L');
    expect(arkitNameAlias('mouthSmile_R')).toBe('mouthSmileRight');
    expect(arkitNameAlias('jawOpen')).toBeNull();
  });

  it('remaps ARKit weights onto facecap morph names', () => {
    const out = remapArkitWeightsToMorphNames(
      { eyeBlinkLeft: 0.8, jawOpen: 0.5, mouthSmileRight: 0.4 },
      ['eyeBlink_L', 'eyeBlink_R', 'jawOpen', 'mouthSmile_R'],
    );
    expect(out.eyeBlink_L).toBeCloseTo(0.8);
    expect(out.jawOpen).toBeCloseTo(0.5);
    expect(out.mouthSmile_R).toBeCloseTo(0.4);
  });

  it('maps Sakura Expression_* smile onto VALID Apple morph names', () => {
    const sakura = {
      Expressions_mouthSmile_max: 0.85,
      Expressions_eyeSquintL_max: 0.35,
      Expressions_eyeSquintR_max: 0.35,
    };
    const mesh = sakuraMorphsToArkitMeshWeights(sakura, [
      'mouthSmileLeft',
      'mouthSmileRight',
      'eyeSquintLeft',
      'eyeSquintRight',
    ]);
    expect(
      (mesh.mouthSmileLeft || 0) + (mesh.mouthSmileRight || 0),
    ).toBeGreaterThan(0.2);
  });

  it('maps Sakura Expression_* blink onto facecap underscore names', () => {
    const sakura = {
      Expressions_eyeClosedL_max: 1,
      Expressions_eyeClosedR_max: 1,
    };
    const mesh = sakuraMorphsToArkitMeshWeights(sakura, [
      'eyeBlink_L',
      'eyeBlink_R',
      'jawOpen',
    ]);
    expect(mesh.eyeBlink_L).toBeGreaterThan(0.5);
    expect(mesh.eyeBlink_R).toBeGreaterThan(0.5);
  });
});
