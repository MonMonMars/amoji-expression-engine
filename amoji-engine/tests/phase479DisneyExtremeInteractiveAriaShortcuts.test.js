import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 479 Extreme interactive aria-keyshortcuts', () => {
  it('adds aria-keyshortcuts to strip rows and related interactive surfaces', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('interactive rows · aria-keyshortcuts');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremeStripsFilterSummary" aria-keyshortcuts="Enter Space Shift+Enter"');
    expect(src).toContain('id="disneyExtremePin" aria-keyshortcuts="Enter Space Shift+Enter"');
    expect(src).toContain('id="disneyExtremeCurveStrip" aria-keyshortcuts="Enter Space Shift+Enter"');
    expect(src).toContain('id="disneyExtremePanel" title="Drop Extreme snapshot');
    expect(src).toContain('aria-keyshortcuts="Enter Space Shift+Enter"');
  });
});
