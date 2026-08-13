import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 393 Extreme F11 dirty strip', () => {
  it('resolves F11/Shift+F11 dirty remaps and wires buttons', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'F11' }).action).toBe(
      'showBaselineDirtyStrip',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'F11', shiftKey: true }).action,
    ).toBe('copyBaselineDirtyStrip');
    expect(resolveDisneyExtremeHotkey({ key: 'Home' }).action).toBe(
      'showBaselineDirtyStrip',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'End' }).action).toBe(
      'copyBaselineDirtyStrip',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('F11 dirty strip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+F11 copy dirty');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeDirtyStripFKey');
    expect(src).toContain('btnDisneyExtremeCopyDirtyStripFKey');
  });
});
