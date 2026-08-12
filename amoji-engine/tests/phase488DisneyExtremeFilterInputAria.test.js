import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 488 Extreme filter input aria metadata', () => {
  it('adds aria-label and aria-describedby on strips filter input', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('strips filter input · aria metadata');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremeStripsFilter"');
    expect(src).toContain('aria-label="Filter Extreme strips"');
    expect(src).toContain('aria-describedby="disneyExtremeStripsFilterSummary"');
  });
});
