import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  formatDisneyExtremeLiveHud,
  easeEmotionIntensity,
} from '../../engine/layers/emotionMorphs.js';
import { disneyExtremeBodyMix } from '../../engine/layers/neckShoulder.js';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 122 Extreme HUD ease + body mix readout', () => {
  it('includes ease and optional body mix in live status', () => {
    const shapeInt = 1.5;
    const bodyInt = 1.4;
    const hud = formatDisneyExtremeLiveHud({
      enabled: true,
      shapeInt,
      bodyInt,
      bodyOn: true,
      bodyMix: disneyExtremeBodyMix(bodyInt),
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(hud.ease).toBeCloseTo(easeEmotionIntensity(shapeInt));
    expect(hud.status).toContain(`ease ${easeEmotionIntensity(shapeInt).toFixed(2)}`);
    expect(hud.status).toContain(
      `mix ${disneyExtremeBodyMix(bodyInt).toFixed(2)}`,
    );
  });

  it('Face Live passes disneyExtremeBodyMix into the HUD helper', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('disneyExtremeBodyMix');
    expect(src).toContain('formatDisneyExtremeLiveHudFromSnapshot(extremeSnap)');
  });
});
