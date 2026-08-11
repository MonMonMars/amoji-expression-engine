import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 370 Extreme Shift+PageUp open strips', () => {
  it('resolves Shift+PageUp and wires Face Live open strips', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'PageUp', shiftKey: true }).action,
    ).toBe('openBaselineStrips');
    expect(resolveDisneyExtremeHotkey({ key: 'PageUp' }).action).toBe(
      'toggleBaselineStrips',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+PageUp open strips');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeOpenStrips');
    expect(src).toContain('function openDisneyExtremeStrips');
    expect(src).toContain("resolved.action === 'openBaselineStrips'");
  });
});
