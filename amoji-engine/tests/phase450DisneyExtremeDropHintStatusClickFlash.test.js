import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 450 Extreme drop hint + status click flash', () => {
  it('wires click flash on drop hint and status row', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('drop hint · click flash');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('status row · click digest');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('status row · dbl-click copy');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function flashDisneyExtremeDropHint');
    expect(src).toContain('function flashDisneyExtremeHotkeyDigestStatus');
    expect(src).toContain(
      "bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeDropHint')",
    );
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremeStatus');
    expect(src).toContain('flashDisneyExtremeHotkeyDigestStatus();');
    expect(src).toContain('copyDisneyExtremeSummary();');
    expect(src).toContain('click/Enter/Space flash · dbl-click paste');
  });
});
