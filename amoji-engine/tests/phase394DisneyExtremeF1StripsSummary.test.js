import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 394 Extreme F1 strips summary', () => {
  it('resolves F1/Shift+F1 strips summary remaps and wires buttons', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'F1' }).action).toBe(
      'showBaselineStripsSummary',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'F1', shiftKey: true }).action,
    ).toBe('copyBaselineStripsSummary');
    expect(resolveDisneyExtremeHotkey({ key: 'PageDown' }).action).toBe(
      'showBaselineStripsSummary',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('F1 strips summary');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+F1 copy strips');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeStripsSummaryFKey');
    expect(src).toContain('btnDisneyExtremeCopyStripsSummaryFKey');
  });
});
