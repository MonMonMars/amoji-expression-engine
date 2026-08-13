import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  cycleDisneyExtremeBaselineHistoryIndex,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 280 Extreme Alt+Q / Shift+Alt+Q cycle history', () => {
  it('cycles hist indices, resolves hotkeys, and wires Face Live', () => {
    expect(cycleDisneyExtremeBaselineHistoryIndex(null, 0)).toBe(null);
    expect(cycleDisneyExtremeBaselineHistoryIndex(null, 3)).toBe(2);
    expect(
      cycleDisneyExtremeBaselineHistoryIndex(null, 3, { prev: true }),
    ).toBe(0);
    expect(cycleDisneyExtremeBaselineHistoryIndex(2, 3)).toBe(0);
    expect(
      cycleDisneyExtremeBaselineHistoryIndex(0, 3, { prev: true }),
    ).toBe(2);
    expect(
      resolveDisneyExtremeHotkey({ key: 'q', altKey: true }).action,
    ).toBe('cycleBaselineHistoryNext');
    expect(
      resolveDisneyExtremeHotkey({
        key: 'q',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('cycleBaselineHistoryPrev');
    expect(resolveDisneyExtremeHotkey({ key: 'q' }).action).toBe(
      'cycleBaselineFavoriteNext',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'q', shiftKey: true }).action,
    ).toBe('cycleBaselineFavoritePrev');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+Q next hist');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+Q prev hist');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeNextHist');
    expect(src).toContain('btnDisneyExtremePrevHist');
    expect(src).toContain('function cycleDisneyExtremeBaselineHistory');
    expect(src).toContain("resolved.action === 'cycleBaselineHistoryNext'");
    expect(src).toContain("resolved.action === 'cycleBaselineHistoryPrev'");
    expect(typeof engine.cycleDisneyExtremeBaselineHistoryIndex).toBe(
      'function',
    );
  });
});
