import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 458 Extreme status/drop keyboard accessibility', () => {
  it('adds Enter/Space support to status and drop hint rows', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('status row · Enter/Space digest');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('drop hint · Enter/Space flash');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id=\"disneyExtremeStatus\"');
    expect(src).toContain('id=\"disneyExtremeDropHint\"');
    expect(src).toContain('click/Enter/Space digest · dbl-click/⇧Enter copy · C');
    expect(src).toContain('click/Enter/Space flash · dbl-click paste');
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeDropHint')");
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(disneyExtremeStatus");
    expect(src).toContain("setAttribute('role', 'button')");
    expect(src).toContain("setAttribute('tabindex', '0')");
    expect(src).toContain('flashDisneyExtremeHotkeyDigestStatus();');
  });
});
