import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 390 Extreme F8 roots strip', () => {
  it('resolves F8/Shift+F8 roots remaps and wires buttons', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'F8' }).action).toBe(
      'showBaselineRoots',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'F8', shiftKey: true }).action,
    ).toBe('copyBaselineRoots');
    expect(resolveDisneyExtremeHotkey({ key: '\\' }).action).toBe(
      'showBaselineRoots',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('F8 roots strip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+F8 copy roots');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeRootsFKey');
    expect(src).toContain('btnDisneyExtremeCopyRootsFKey');
  });
});
