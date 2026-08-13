import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeHotkeyHelp,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 279 Extreme Alt+H copy hotkey help', () => {
  it('resolves Alt+H and wires Face Live copy help', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'h', altKey: true }).action,
    ).toBe('copyHotkeyHelp');
    expect(resolveDisneyExtremeHotkey({ key: 'h' }).action).toBe('showHelp');
    expect(resolveDisneyExtremeHotkey({ key: '?' }).action).toBe('showHelp');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+H copy help');
    expect(formatDisneyExtremeHotkeyHelp({ enabled: true })).toContain(
      'extreme on',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyHelp');
    expect(src).toContain('function copyDisneyExtremeHotkeyHelp');
    expect(src).toContain("resolved.action === 'copyHotkeyHelp'");
    expect(src).toMatch(
      /copyDisneyExtremeHotkeyHelp[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: 'hotkey help'/,
    );
    expect(src).toContain('DISNEY_EXTREME_HOTKEY_HELP');
  });
});
