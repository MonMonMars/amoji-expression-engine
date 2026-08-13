import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 476 Extreme HUD title hints', () => {
  it('adds title hints for HUD sparks and X diff pill interactions', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('HUD sparks · title hints');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('HUD pill · title hints');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('title="HUD ease spark · click/Enter/Space flash · dbl-click/⇧Enter copy"');
    expect(src).toContain('title="HUD factor bars spark · click/Enter/Space flash · dbl-click/⇧Enter copy"');
    expect(src).toContain('title="HUD body mix spark · click/Enter/Space flash · dbl-click/⇧Enter copy"');
    expect(src).toContain('title="X diff pill · click/Enter/Space flash diff · dbl-click/⇧Enter copy diff"');
  });
});
