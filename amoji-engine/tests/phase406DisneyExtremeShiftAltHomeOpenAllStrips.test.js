import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 406 Extreme ⇧Alt+Home open all strips', () => {
  it('resolves Shift+Alt+Home and wires open+flash all strips', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'Home',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('openBaselineAllStrips');
    expect(
      resolveDisneyExtremeHotkey({ key: 'Home', altKey: true }).action,
    ).toBe('showBaselineAllStrips');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      '⇧Alt+Home open all strips',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeOpenAllStrips');
    expect(src).toContain('function openDisneyExtremeAllStrips');
    expect(src).toContain("resolved.action === 'openBaselineAllStrips'");
  });
});
