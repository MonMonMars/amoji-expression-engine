import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeStripsFilterSummary,
} from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 413 Extreme strips filter UI', () => {
  it('formats filter summary and wires live filter + empty state', () => {
    expect(formatDisneyExtremeStripsFilterSummary({ total: 11 })).toBe(
      'filter · all · 11',
    );
    expect(
      formatDisneyExtremeStripsFilterSummary({
        query: 'pin',
        visible: 1,
        total: 11,
      }),
    ).toBe('filter · "pin" · 1/11');
    expect(
      formatDisneyExtremeStripsFilterSummary({
        query: 'zzz',
        visible: 0,
        total: 11,
      }),
    ).toBe('filter · "zzz" · none');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('strips filter · live');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeStripsFilter"');
    expect(src).toContain('btnDisneyExtremeStripsFilterClear');
    expect(src).toContain('disneyExtremeStripsEmpty');
    expect(src).toContain('function applyDisneyExtremeStripsFilter');
    expect(src).toContain('function clearDisneyExtremeStripsFilter');
    expect(src).toContain('formatDisneyExtremeStripsFilterSummary');
    expect(src).toContain('No strips match');
  });
});
