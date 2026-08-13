import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 405 Extreme Alt+Home/End all strips', () => {
  it('resolves Alt+Home/End and wires all-strips flash/copy', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'Home', altKey: true }).action,
    ).toBe('showBaselineAllStrips');
    expect(
      resolveDisneyExtremeHotkey({ key: 'End', altKey: true }).action,
    ).toBe('copyBaselineAllStrips');
    expect(resolveDisneyExtremeHotkey({ key: 'Home' }).action).toBe(
      'showBaselineDirtyStrip',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'End' }).action).toBe(
      'copyBaselineDirtyStrip',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+Home all strips');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+End copy all strips');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeAllStrips');
    expect(src).toContain('btnDisneyExtremeCopyAllStrips');
    expect(src).toContain('function flashDisneyExtremeBaselineAllStrips');
    expect(src).toContain('function copyDisneyExtremeBaselineAllStrips');
    expect(src).toContain("resolved.action === 'showBaselineAllStrips'");
    expect(src).toContain("resolved.action === 'copyBaselineAllStrips'");
  });
});
