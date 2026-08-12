import { describe, expect, it } from 'vitest';
import { summarizeDisneyExtremePrefs } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 447 Extreme catalog summary + button notes', () => {
  it('documents stacks/pin title opts and More IO button notes', () => {
    const prefs = {
      disneyExtreme: true,
      disneyExtremeFactor: 1.6,
      disneyExtremeBody: true,
      disneyExtremeBodyFactor: 1.6,
      disneyExtremeEyeFactor: 1.4,
      disneyExtremeMouthFactor: 1.5,
      intensity: 0.5,
    };
    expect(
      summarizeDisneyExtremePrefs(prefs, {
        stacks: { history: [{}], redo: [], favorites: [] },
        pinFp: 'abc123',
      }),
    ).toContain('stacks · hist 1 · redo 0 · fav 0');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('status title · stacks depths');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('status title · pin fp');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+H copy help · button');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+L stacks · button');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+T open more IO · button');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain("getElementById('btnDisneyExtremeCopyHelp')?.addEventListener('click'");
    expect(src).toContain("getElementById('btnDisneyExtremeStacksList')?.addEventListener('click'");
    expect(src).toContain("getElementById('btnDisneyExtremeFocusPanel')?.addEventListener('click'");
  });
});
