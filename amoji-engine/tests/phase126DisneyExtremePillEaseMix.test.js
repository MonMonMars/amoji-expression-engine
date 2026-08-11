import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  formatDisneyExtremeLiveHud,
  easeEmotionIntensity,
} from '../engine/layers/emotionMorphs.js';
import { disneyExtremeBodyMix } from '../engine/layers/neckShoulder.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 126 Extreme X pill ease + mix', () => {
  it('pill includes ease; mix when bodyMix provided', () => {
    const shapeInt = 1.5;
    const bodyInt = 1.4;
    const mix = disneyExtremeBodyMix(bodyInt);
    const withMix = formatDisneyExtremeLiveHud({
      enabled: true,
      shapeInt,
      bodyInt,
      bodyOn: true,
      bodyMix: mix,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const e = easeEmotionIntensity(shapeInt);
    expect(withMix.pill).toBe(
      `${shapeInt.toFixed(2)} · e${e.toFixed(2)} · m${mix.toFixed(2)}`,
    );
    expect(withMix.bodyMix).toBeCloseTo(mix);
    const noMix = formatDisneyExtremeLiveHud({
      enabled: true,
      shapeInt: 1.12,
      bodyInt: 0.98,
      bodyOn: true,
    });
    expect(noMix.pill).toBe(
      `1.12 · e${easeEmotionIntensity(1.12).toFixed(2)}`,
    );
    expect(noMix.bodyMix).toBeUndefined();
    expect(typeof engine.formatDisneyExtremeLiveHud).toBe('function');
  });

  it('Face Live still drives hudExtreme from extremeHud.pill', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('hudExtreme.textContent = extremeHud.pill');
    expect(src).toContain('bodyMix: disneyExtremeBodyMix(bodyInt)');
  });
});
