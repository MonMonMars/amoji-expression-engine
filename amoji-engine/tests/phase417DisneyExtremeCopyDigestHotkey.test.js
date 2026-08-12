import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_DIGEST,
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeHotkeyDigest,
} from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 417 Extreme Alt+F12 copy digest', () => {
  it('resolves Alt+F12 to copyHotkeyDigest without changing F12 family', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'F12', altKey: true }).action,
    ).toBe('copyHotkeyDigest');
    expect(resolveDisneyExtremeHotkey({ key: 'F12' }).action).toBe(
      'focusStripsFilter',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'F12', shiftKey: true }).action,
    ).toBe('copyStripsFilterSummary');
    expect(
      resolveDisneyExtremeHotkey({
        key: 'F12',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('clearStripsFilter');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+F12 copy digest');
    expect(DISNEY_EXTREME_HOTKEY_DIGEST).not.toContain('Alt+F12 copy digest');
    expect(formatDisneyExtremeHotkeyDigest({ enabled: true })).toContain(
      'extreme on',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('<kbd>Alt+F12</kbd>');
    expect(src).toContain("resolved.action === 'copyHotkeyDigest'");
    expect(src).toContain('copied · hotkey digest');
  });
});
