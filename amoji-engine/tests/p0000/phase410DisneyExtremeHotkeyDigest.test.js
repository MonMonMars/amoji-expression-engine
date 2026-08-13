import { describe, expect, it } from 'vitest';
import {
  DISNEY_EXTREME_HOTKEY_DIGEST,
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeHotkeyDigest,
  formatDisneyExtremeHotkeyDigestCatalog,
} from '../../engine/layers/emotionMorphs.js';

describe('Phase 410 Extreme hotkey digest helpers', () => {
  it('builds action/nudge/escape digest without note-only entries', () => {
    expect(DISNEY_EXTREME_HOTKEY_DIGEST).toContain('H help');
    expect(DISNEY_EXTREME_HOTKEY_DIGEST).toContain('Esc clear');
    expect(DISNEY_EXTREME_HOTKEY_DIGEST).toContain('[ ] shape');
    expect(DISNEY_EXTREME_HOTKEY_DIGEST).not.toContain('Alt+H copy help');
    expect(DISNEY_EXTREME_HOTKEY_DIGEST).not.toContain('H digest flash');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('H digest flash');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+F12 copy digest');
    expect(formatDisneyExtremeHotkeyDigestCatalog()).toBe(
      DISNEY_EXTREME_HOTKEY_DIGEST,
    );
    expect(formatDisneyExtremeHotkeyDigest({ enabled: true })).toContain(
      'extreme on',
    );
    expect(formatDisneyExtremeHotkeyDigest({ enabled: false })).toContain(
      'extreme off',
    );
  });
});
