import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 421 Extreme all-strips filtered catalog', () => {
  it('documents filtered all-strips bundle in catalog and face-live', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('all strips · filtered');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('all strips · bundle');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('filterDisneyExtremeAllStripsKeys');
    expect(src).toContain('DISNEY_EXTREME_ALL_STRIPS_LINE_COUNT');
    expect(src).toContain('filter-aware when filter active');
  });
});
