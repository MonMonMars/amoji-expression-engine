import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  formatDisneyExtremeMultiHashLoadLabel,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 265 Extreme multi-hash load toast', () => {
  it('formats combined link label and wires silent hash apply', () => {
    expect(formatDisneyExtremeMultiHashLoadLabel([])).toBe('link · empty');
    expect(formatDisneyExtremeMultiHashLoadLabel(['snapshot · fp abcd1234'])).toBe(
      'link · snapshot · fp abcd1234',
    );
    expect(
      formatDisneyExtremeMultiHashLoadLabel([
        'snapshot · fp abcd1234',
        'hist 2',
        'fav 1',
      ]),
    ).toBe('link · snapshot · fp abcd1234 · hist 2 · fav 1');
    expect(typeof engine.formatDisneyExtremeMultiHashLoadLabel).toBe(
      'function',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('formatDisneyExtremeMultiHashLoadLabel');
    expect(src).toContain('extremeHashLoadParts');
    expect(src).toContain('silent: true');
    expect(src).toContain('applyDisneyExtremeBaselineStacksFromHash');
    expect(src).toContain('parts: extremeHashLoadParts');
  });
});
