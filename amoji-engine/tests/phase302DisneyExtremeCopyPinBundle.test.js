import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 302 Extreme ⇧Alt+A copy pin bundle', () => {
  it('resolves ⇧Alt+A and wires Face Live pin bundle copy', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'a',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyBaselinePinBundle');
    expect(
      resolveDisneyExtremeHotkey({ key: 'a', altKey: true }).action,
    ).toBe('showBaselinePinBundle');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+A copy pin bundle');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyPinBundle');
    expect(src).toContain('function copyDisneyExtremeBaselinePinBundle');
    expect(src).toContain("resolved.action === 'copyBaselinePinBundle'");
    expect(src).toContain('copied · pin ·');
  });
});
