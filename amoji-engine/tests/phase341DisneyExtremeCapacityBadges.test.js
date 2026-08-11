import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineHistoryCapacityLabel,
  formatDisneyExtremeBaselineFavoritesCapacityLabel,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 341 Extreme chip-row capacity badges', () => {
  it('formats hist/fav capacity badges and wires Face Live chip rows', () => {
    expect(formatDisneyExtremeBaselineHistoryCapacityLabel(0)).toBe('hist · 0/8');
    expect(formatDisneyExtremeBaselineHistoryCapacityLabel(3)).toBe('hist · 3/8');
    expect(
      formatDisneyExtremeBaselineHistoryCapacityLabel(2, { kind: 'redo' }),
    ).toBe('redo · 2/8');
    expect(formatDisneyExtremeBaselineFavoritesCapacityLabel(0)).toBe(
      'fav · 0/8',
    );
    expect(formatDisneyExtremeBaselineFavoritesCapacityLabel(5)).toBe(
      'fav · 5/8',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('chip rows · capacity');
    expect(typeof engine.formatDisneyExtremeBaselineHistoryCapacityLabel).toBe(
      'function',
    );
    expect(
      typeof engine.formatDisneyExtremeBaselineFavoritesCapacityLabel,
    ).toBe('function');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('formatDisneyExtremeBaselineHistoryCapacityLabel(');
    expect(src).toContain('formatDisneyExtremeBaselineFavoritesCapacityLabel(');
    expect(src).toContain('hist · 0/8');
    expect(src).toContain('fav · 0/8');
  });
});
