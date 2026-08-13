import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 398 Extreme Alt+PageUp close strips', () => {
  it('resolves Alt+PageUp and wires Face Live close strips', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'PageUp', altKey: true }).action,
    ).toBe('closeBaselineStrips');
    expect(resolveDisneyExtremeHotkey({ key: 'PageUp' }).action).toBe(
      'toggleBaselineStrips',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'PageUp', shiftKey: true }).action,
    ).toBe('openBaselineStrips');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+PageUp close strips');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCloseStrips');
    expect(src).toContain('function closeDisneyExtremeStrips');
    expect(src).toContain("resolved.action === 'closeBaselineStrips'");
  });
});
