import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 475 Extreme HUD spark aria labels', () => {
  it('removes aria-hidden from interactive HUD sparks and adds aria-labels', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('HUD sparks · aria labels');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="hudExtremeSpark" class="hud-extreme-spark is-off"');
    expect(src).toContain('aria-label="HUD ease spark"');
    expect(src).toContain('aria-label="HUD factor bars spark"');
    expect(src).toContain('aria-label="HUD body mix spark"');
    expect(src).not.toContain('id="hudExtremeSpark" class="hud-extreme-spark is-off" aria-hidden="true"');
  });
});
