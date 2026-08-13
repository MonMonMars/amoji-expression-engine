import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { formatDisneyExtremeLiveHud } from '../../engine/layers/emotionMorphs.js';
import { DISNEY_EXTREME_NECK_SCALE_BLEND } from '../../engine/layers/neckShoulder.js';
import * as engine from '../../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 151 Extreme live HUD neck blend', () => {
  it('includes neck blend in status when body is on', () => {
    const hud = formatDisneyExtremeLiveHud({
      enabled: true,
      shapeInt: 1.1,
      bodyInt: 1.1,
      bodyOn: true,
      bodyMix: 1.1,
      neckBlend: DISNEY_EXTREME_NECK_SCALE_BLEND,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(hud.neckBlend).toBe(DISNEY_EXTREME_NECK_SCALE_BLEND);
    expect(hud.status).toContain(
      `neck ${DISNEY_EXTREME_NECK_SCALE_BLEND.toFixed(2)}`,
    );
    const bodyOff = formatDisneyExtremeLiveHud({
      enabled: true,
      shapeInt: 1.1,
      bodyInt: 0.7,
      bodyOn: false,
      neckBlend: DISNEY_EXTREME_NECK_SCALE_BLEND,
    });
    expect(bodyOff.neckBlend).toBeUndefined();
    expect(bodyOff.status).not.toContain('neck ');
    expect(typeof engine.formatDisneyExtremeLiveHud).toBe('function');
  });

  it('Face Live passes neckBlend into live HUD', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('DISNEY_EXTREME_NECK_SCALE_BLEND');
    expect(src).toContain('formatDisneyExtremeLiveHudFromSnapshot(extremeSnap)');
    expect(src).toContain('disneyExtremeSnapshot(displayInt)');
  });
});
