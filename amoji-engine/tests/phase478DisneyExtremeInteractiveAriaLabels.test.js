import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 478 Extreme interactive aria-label coverage', () => {
  it('adds aria-labels to non-button interactive rows and panel/status surfaces', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('interactive rows · aria labels');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremeStripsSummary" aria-keyshortcuts="Enter Space Shift+Enter" aria-label="Extreme strips summary"');
    expect(src).toContain('id="disneyExtremeHistory" aria-keyshortcuts="Enter Space Shift+Enter" aria-label="Extreme history row"');
    expect(src).toContain('id="disneyExtremeFavorites" aria-keyshortcuts="Enter Space Shift+Enter" aria-label="Extreme favorites row"');
    expect(src).toContain('id="disneyExtremeStatus" aria-keyshortcuts="Enter Space Shift+Enter" aria-label="Extreme status summary"');
    expect(src).toContain('id="disneyExtremeDropHint" aria-keyshortcuts="Enter Space Shift+Enter" aria-label="Extreme drop hint"');
  });
});
