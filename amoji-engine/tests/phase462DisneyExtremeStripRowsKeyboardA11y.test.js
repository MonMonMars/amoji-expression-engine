import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 462 Extreme strip rows keyboard accessibility', () => {
  it('adds role/tabindex/keydown for strip summary and rows', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('strip rows · Enter/Space flash');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain("getElementById('disneyExtremeStripsSummary')?.setAttribute('role', 'button')");
    expect(src).toContain("getElementById('disneyExtremeTips')?.setAttribute('tabindex', '0')");
    expect(src).toContain("getElementById('disneyExtremeCapacity')?.addEventListener('keydown'");
    expect(src).toContain("getElementById('disneyExtremePin')?.addEventListener('keydown'");
    expect(src).toContain("getElementById('disneyExtremeCurveStrip')?.addEventListener('keydown'");
  });
});
