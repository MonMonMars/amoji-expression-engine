import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 501 Extreme status/drop/panel bind helper', () => {
  it('migrates status/drop/panel to bind helper with paste support', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('status/drop/panel · bind helper');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremePanel');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremeStatus');
    expect(src).not.toContain('disneyExtremeStatus?.addEventListener(\'keydown\'');
  });
});
