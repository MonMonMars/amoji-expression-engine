import { describe, expect, it } from 'vitest';
import { summarizeDisneyExtremePrefs } from '../../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 445 Extreme summary stacks + pin fp', () => {
  it('appends stacks depths and pin fp to prefs summary title', () => {
    const prefs = {
      disneyExtreme: true,
      disneyExtremeFactor: 1.6,
      disneyExtremeBody: true,
      disneyExtremeBodyFactor: 1.6,
      disneyExtremeEyeFactor: 1.4,
      disneyExtremeMouthFactor: 1.5,
      intensity: 0.5,
    };
    const withStacks = summarizeDisneyExtremePrefs(prefs, {
      stacks: { history: [{}, {}], redo: [{}], favorites: [] },
      pinFp: 'abc123',
    });
    expect(withStacks).toContain('stacks · hist 2 · redo 1 · fav 0');
    expect(withStacks).toContain('pin abc123');
    const noPin = summarizeDisneyExtremePrefs(prefs, { pinFp: null });
    expect(noPin).toContain('pin · none');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('share copy · empty guard');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('diff copy · empty guard');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function disneyExtremePrefsSummaryOpts');
    expect(src).toContain('disneyExtremePrefsSummaryOpts()');
    expect(src).toContain('title="Copy prefs summary · filter-aware when filter active"');
    expect(src).toContain('title="Enable Extreme tier · ⇧X"');
  });
});
