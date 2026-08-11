import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 260 Extreme Esc clears chip compare', () => {
  it('resolves Esc when chip compare is held and wires Face Live clear', () => {
    expect(
      resolveDisneyExtremeHotkey(
        { key: 'Escape' },
        { holdingChipCompare: true },
      ).action,
    ).toBe('clearStatusHold');
    expect(
      resolveDisneyExtremeHotkey({ key: 'Escape' }, { holdingStatus: false })
        .ok,
    ).toBe(false);
    expect(
      resolveDisneyExtremeHotkey(
        { key: 'Escape' },
        { holdingStatus: true },
      ).action,
    ).toBe('clearStatusHold');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('holdingChipCompare: !!lastExtremeChipCompare');
    expect(src).toContain('lastExtremeChipCompare = null');
    expect(src).toContain('cleared · chip compare');
  });
});
