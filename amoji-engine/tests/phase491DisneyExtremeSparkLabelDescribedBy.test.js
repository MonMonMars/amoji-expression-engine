import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 491 Extreme spark label aria-describedby', () => {
  it('links spark labels to their spark surfaces via aria-describedby', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('spark labels · aria-describedby');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('aria-describedby="disneyExtremeFactorBars"');
    expect(src).toContain('aria-describedby="disneyExtremeEaseSpark"');
    expect(src).toContain('aria-describedby="disneyExtremeBodySpark"');
  });
});
