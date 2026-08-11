import { describe, expect, it } from 'vitest';
import {
  disneyExtremeHistoryJumpIndex,
  DISNEY_EXTREME_BASELINE_HISTORY_LIMIT,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 230 Extreme hist digit jump index', () => {
  it('maps 1–8 to 0-based indices and rejects others', () => {
    expect(disneyExtremeHistoryJumpIndex('1')).toBe(0);
    expect(disneyExtremeHistoryJumpIndex('8')).toBe(7);
    expect(disneyExtremeHistoryJumpIndex('0')).toBe(null);
    expect(disneyExtremeHistoryJumpIndex('9')).toBe(null);
    expect(disneyExtremeHistoryJumpIndex('a')).toBe(null);
    expect(
      disneyExtremeHistoryJumpIndex('3', {
        limit: DISNEY_EXTREME_BASELINE_HISTORY_LIMIT,
      }),
    ).toBe(2);
    expect(typeof engine.disneyExtremeHistoryJumpIndex).toBe('function');
  });
});
