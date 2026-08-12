import { describe, expect, it } from 'vitest';
import { summarizeDisneyExtremePrefs } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 451 Extreme catalog copy summary notes', () => {
  it('documents copy summary parity and button title rollout', () => {
    const prefs = {
      disneyExtreme: true,
      disneyExtremeFactor: 1.6,
      disneyExtremeBody: true,
      disneyExtremeBodyFactor: 1.6,
      disneyExtremeEyeFactor: 1.4,
      disneyExtremeMouthFactor: 1.5,
      intensity: 0.5,
    };
    const baseline = { enabled: true, shapeFactor: 1.6 };
    const text = summarizeDisneyExtremePrefs(prefs, {
      baseline,
      stacks: { history: [{}], redo: [], favorites: [] },
      pinFp: 'abc123',
      stripsFilter: 'filter · "pin" · 1/11',
    });
    expect(text).toContain('dirty');
    expect(text).toContain('stacks · hist 1 · redo 0 · fav 0');
    expect(text).toContain('pin abc123');
    expect(text).toContain('filter · "pin" · 1/11');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('C copy · includes stacks+pin');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('C copy · includes baseline dirty/clean');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('toolbar buttons · title tooltips');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('more IO buttons · title tooltips');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('copy flash · unified audit');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('disneyExtremePrefsSummaryOpts()');
    expect(src).toMatch(
      /copyDisneyExtremeSummary[\s\S]*?disneyExtremePrefsSummaryOpts\(\)/,
    );
    expect(src).toMatch(
      /syncDisneyExtremePrefsSummary[\s\S]*?disneyExtremePrefsSummaryOpts\(\)/,
    );
  });
});
