import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 391 Extreme F9 active strip', () => {
  it('resolves F9/Shift+F9 active remaps and wires buttons', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'F9' }).action).toBe(
      'showBaselineActive',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'F9', shiftKey: true }).action,
    ).toBe('copyBaselineActive');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('F9 active strip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+F9 copy active');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeActiveFKey');
    expect(src).toContain('btnDisneyExtremeCopyActiveFKey');
  });
});
