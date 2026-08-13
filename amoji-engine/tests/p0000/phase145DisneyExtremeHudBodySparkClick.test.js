import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 145 Extreme HUD body spark click flashes mix', () => {
  it('makes HUD body mix spark interactive', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(hudBodySpark');
    expect(src).toContain('.hud-body-spark');
    expect(src).toContain('pointer-events: auto');
  });
});
