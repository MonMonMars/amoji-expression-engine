import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 303 Extreme ⇧Alt+D copy pin summary', () => {
  it('resolves ⇧Alt+D and wires Face Live pin summary copy', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'd',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyBaselinePin');
    expect(
      resolveDisneyExtremeHotkey({ key: 'd', altKey: true }).action,
    ).toBe('showBaselinePin');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+D copy pin summary');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyPinSummary');
    expect(src).toContain('function copyDisneyExtremeBaselinePinSummary');
    expect(src).toContain("resolved.action === 'copyBaselinePin'");
  });
});
