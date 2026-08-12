import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 485 Extreme strips empty keyboard', () => {
  it('wires Enter/Space clear on strips empty row', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('strips empty · Enter/Space clear');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremeStripsEmpty"');
    expect(src).toContain('aria-label="Extreme strips empty"');
    expect(src).toContain("getElementById('disneyExtremeStripsEmpty')");
    expect(src).toContain('clearDisneyExtremeStripsFilterFlash()');
  });
});
