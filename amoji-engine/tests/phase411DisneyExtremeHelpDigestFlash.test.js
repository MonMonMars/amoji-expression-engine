import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 411 Extreme H digest flash + copy digest', () => {
  it('keeps Alt+H full help and wires digest flash/copy', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'h' }).action).toBe('showHelp');
    expect(
      resolveDisneyExtremeHotkey({ key: 'h', altKey: true }).action,
    ).toBe('copyHotkeyHelp');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('H digest flash');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('help digest · copy');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain("resolved.action === 'showHelp'");
    expect(src).toContain('formatDisneyExtremeHotkeyDigest({');
    expect(src).toContain('btnDisneyExtremeCopyDigest');
    expect(src).toContain('function copyDisneyExtremeHotkeyDigest');
    expect(src).toContain('copied · hotkey digest');
    expect(src).toContain('function copyDisneyExtremeHotkeyHelp');
    expect(src).toContain('copied · hotkey help');
  });
});
