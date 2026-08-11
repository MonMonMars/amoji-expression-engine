import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  cycleDisneyExtremeBaselineRedoIndex,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 282 Extreme Alt+U / Shift+Alt+U cycle redo', () => {
  it('cycles redo indices, resolves hotkeys, and wires Face Live', () => {
    expect(cycleDisneyExtremeBaselineRedoIndex(null, 0)).toBe(null);
    expect(cycleDisneyExtremeBaselineRedoIndex(null, 3)).toBe(2);
    expect(
      cycleDisneyExtremeBaselineRedoIndex(null, 3, { prev: true }),
    ).toBe(0);
    expect(cycleDisneyExtremeBaselineRedoIndex(2, 3)).toBe(0);
    expect(
      resolveDisneyExtremeHotkey({ key: 'u', altKey: true }).action,
    ).toBe('cycleBaselineRedoNext');
    expect(
      resolveDisneyExtremeHotkey({
        key: 'u',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('cycleBaselineRedoPrev');
    expect(resolveDisneyExtremeHotkey({ key: 'u' }).action).toBe(
      'undoBaseline',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'u', shiftKey: true }).action,
    ).toBe('redoBaseline');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+U next redo');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+U prev redo');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeNextRedo');
    expect(src).toContain('btnDisneyExtremePrevRedo');
    expect(src).toContain('function cycleDisneyExtremeBaselineRedo');
    expect(src).toContain("resolved.action === 'cycleBaselineRedoNext'");
    expect(src).toContain("resolved.action === 'cycleBaselineRedoPrev'");
    expect(typeof engine.cycleDisneyExtremeBaselineRedoIndex).toBe('function');
  });
});
