import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 323 Extreme ⇧Alt+K clear hist keep redo', () => {
  it('resolves ⇧Alt+K and wires Face Live clear hist while keeping redo', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'k',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('clearBaselineHistoryKeepRedo');
    expect(
      resolveDisneyExtremeHotkey({ key: 'k', altKey: true }).action,
    ).toBe('clearBaselinePin');
    expect(
      resolveDisneyExtremeHotkey({ key: 'k', shiftKey: true }).action,
    ).toBe('clearBaselineHistory');
    expect(resolveDisneyExtremeHotkey({ key: 'k' }).action).toBe(
      'clearBaseline',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      '⇧Alt+K clear hist keep redo',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeClearHistKeepRedo');
    expect(src).toContain('function clearDisneyExtremeBaselineHistoryKeepRedo');
    expect(src).toContain("resolved.action === 'clearBaselineHistoryKeepRedo'");
    expect(src).toContain('cleared · hist · keep redo');
  });
});
