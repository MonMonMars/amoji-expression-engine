import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 407 Extreme ⇧Alt+End copy all strips open', () => {
  it('resolves Shift+Alt+End and wires open+copy all strips', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'End',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyBaselineAllStripsOpen');
    expect(
      resolveDisneyExtremeHotkey({ key: 'End', altKey: true }).action,
    ).toBe('copyBaselineAllStrips');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+End copy all open');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyAllStripsOpen');
    expect(src).toContain('function copyDisneyExtremeBaselineAllStripsOpen');
    expect(src).toContain("resolved.action === 'copyBaselineAllStripsOpen'");
  });
});
