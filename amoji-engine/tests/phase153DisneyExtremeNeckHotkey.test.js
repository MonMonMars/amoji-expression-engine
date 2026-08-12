import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import {
  formatDisneyExtremeNeckLabel,
  DISNEY_EXTREME_NECK_SCALE_BLEND,
  disneyExtremeBodyMix,
} from '../engine/layers/neckShoulder.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 153 Extreme N neck flash + HUD factors click', () => {
  it('resolves N and formats neck label', () => {
    expect(matchDisneyExtremeHotkey('N')?.entry.id).toBe('showNeckBlend');
    expect(resolveDisneyExtremeHotkey({ key: 'n' }).action).toBe(
      'showNeckBlend',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('N neck');
    expect(
      formatDisneyExtremeNeckLabel({
        enabled: true,
        bodyOn: true,
        neckBlend: DISNEY_EXTREME_NECK_SCALE_BLEND,
        bodyInt: 1.2,
      }),
    ).toBe(
      `neck ${DISNEY_EXTREME_NECK_SCALE_BLEND.toFixed(2)} · mix ${disneyExtremeBodyMix(1.2).toFixed(2)} @ 1.20`,
    );
    expect(
      formatDisneyExtremeNeckLabel({ enabled: false }),
    ).toContain('(off)');
    expect(typeof engine.formatDisneyExtremeNeckLabel).toBe('function');
  });

  it('Face Live wires N + HUD factor bars click', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("resolved.action === 'showNeckBlend'");
    expect(src).toContain('function flashDisneyExtremeNeck()');
    expect(src).toContain('<kbd>N</kbd>');
    expect(src).toContain(
      'bindDisneyExtremeFlashCopySurface(hudExtremeFactors',
    );
  });
});
