import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 321 Extreme ⇧Alt+W wipe all', () => {
  it('resolves ⇧Alt+W and wires Face Live wipe stacks + pin', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'w',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('wipeBaselineAll');
    expect(
      resolveDisneyExtremeHotkey({ key: 'w', altKey: true }).action,
    ).toBe('clearBaselineStacks');
    expect(
      resolveDisneyExtremeHotkey({ key: 'w', shiftKey: true }).action,
    ).toBe('clearBaselineFavorites');
    expect(resolveDisneyExtremeHotkey({ key: 'w' }).action).toBe(
      'clearBaselineRedo',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+W wipe all');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeWipeAll');
    expect(src).toContain('function wipeDisneyExtremeBaselineAll');
    expect(src).toContain("resolved.action === 'wipeBaselineAll'");
    expect(src).toContain('wiped · all');
  });
});
