import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 480 Extreme HUD aria-keyshortcuts metadata', () => {
  it('adds aria-keyshortcuts to HUD sparks and X diff pill', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('HUD sparks/pill · aria-keyshortcuts');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Extreme panel · aria metadata');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="pillExtreme" title="X diff pill · click/Enter/Space flash diff · dbl-click/⇧Enter copy diff" aria-label="Extreme diff pill" aria-keyshortcuts="Enter Space Shift+Enter"');
    expect(src).toContain('id="hudExtremeSpark" class="hud-extreme-spark is-off" title="HUD ease spark · click/Enter/Space flash · dbl-click/⇧Enter copy" aria-label="HUD ease spark" aria-keyshortcuts="Enter Space Shift+Enter"');
    expect(src).toContain('id="hudExtremeFactors" class="hud-extreme-factors is-off" title="HUD factor bars spark · click/Enter/Space flash · dbl-click/⇧Enter copy" aria-label="HUD factor bars spark" aria-keyshortcuts="Enter Space Shift+Enter"');
    expect(src).toContain('id="hudBodySpark" class="hud-body-spark is-off" title="HUD body mix spark · click/Enter/Space flash · dbl-click/⇧Enter copy" aria-label="HUD body mix spark" aria-keyshortcuts="Enter Space Shift+Enter"');
  });
});
