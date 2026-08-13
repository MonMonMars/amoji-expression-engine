import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 401 Extreme ⇧Alt+PageUp open curves', () => {
  it('resolves Shift+Alt+PageUp and wires open+flash curve strips', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'PageUp',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('openBaselineCurveStrips');
    expect(
      resolveDisneyExtremeHotkey({ key: 'PageUp', altKey: true }).action,
    ).toBe('closeBaselineStrips');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+PageUp open curves');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeOpenCurveStrips');
    expect(src).toContain('function openDisneyExtremeCurveStrips');
    expect(src).toContain("resolved.action === 'openBaselineCurveStrips'");
  });
});
