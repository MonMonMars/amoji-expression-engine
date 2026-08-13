import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 409 Extreme all-strips open opts wiring', () => {
  it('wires flash/copy open opts and documents catalog notes', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      '⇧Alt+Home open all strips',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+End copy all open');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('all strips · bundle');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('flashDisneyExtremeBaselineAllStrips({ open: true })');
    expect(src).toContain(
      'copyDisneyExtremeBaselineAllStrips({ open: true })',
    );
    expect(src).toContain('if (opts.open) openDisneyExtremeStrips()');
  });
});
