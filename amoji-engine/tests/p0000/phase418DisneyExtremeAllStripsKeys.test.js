import { describe, expect, it } from 'vitest';
import {
  DISNEY_EXTREME_ALL_STRIPS_KEYS,
  DISNEY_EXTREME_ALL_STRIPS_LINE_COUNT,
  formatDisneyExtremeAllStripsFilterBit,
  filterDisneyExtremeAllStripsKeys,
  DISNEY_EXTREME_HOTKEY_HELP,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 418 Extreme all-strips keys + filter bit', () => {
  it('exports keys, line count, and filter bit helpers', () => {
    expect(DISNEY_EXTREME_ALL_STRIPS_LINE_COUNT).toBe(11);
    expect(DISNEY_EXTREME_ALL_STRIPS_KEYS).toHaveLength(11);
    expect(DISNEY_EXTREME_ALL_STRIPS_KEYS[0]).toBe('tips');
    expect(DISNEY_EXTREME_ALL_STRIPS_KEYS[10]).toBe('summary');
    expect(formatDisneyExtremeAllStripsFilterBit({})).toBe('');
    expect(
      formatDisneyExtremeAllStripsFilterBit({
        filterQuery: 'pin',
        filterVisible: 1,
        filterTotal: 11,
      }),
    ).toBe('filter · "pin" · 1/11');
    expect(filterDisneyExtremeAllStripsKeys(['pin', 'dirty'])).toEqual([
      'pin',
      'dirty',
    ]);
    expect(filterDisneyExtremeAllStripsKeys([])).toEqual([]);
    expect(filterDisneyExtremeAllStripsKeys(null)).toBeNull();
    expect(engine.DISNEY_EXTREME_ALL_STRIPS_LINE_COUNT).toBe(11);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('filter · bundle');
  });
});
