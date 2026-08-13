import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 371 Extreme Shift+PageDown copy strips', () => {
  it('resolves Shift+PageDown and wires Face Live strips clipboard copy', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'PageDown', shiftKey: true }).action,
    ).toBe('copyBaselineStripsSummary');
    expect(resolveDisneyExtremeHotkey({ key: 'PageDown' }).action).toBe(
      'showBaselineStripsSummary',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'Shift+PageDown copy strips',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyStripsSummary');
    expect(src).toContain('function copyDisneyExtremeBaselineStripsSummary');
    expect(src).toContain("resolved.action === 'copyBaselineStripsSummary'");
  });
});
