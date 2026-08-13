import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 392 Extreme F10 pin strip + copy', () => {
  it('resolves F10/Shift+F10 pin remaps and wires copy pin strip', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'F10' }).action).toBe(
      'showBaselinePinStrip',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'F10', shiftKey: true }).action,
    ).toBe('copyBaselinePinStrip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('F10 pin strip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+F10 copy pin');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremePinStripFKey');
    expect(src).toContain('btnDisneyExtremeCopyPinStrip');
    expect(src).toContain('function copyDisneyExtremeBaselinePinStrip');
    expect(src).toContain("resolved.action === 'copyBaselinePinStrip'");
  });
});
