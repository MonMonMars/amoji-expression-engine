import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  cycleDisneyExtremeBaselineFavoriteIndex,
  matchDisneyExtremeHotkey,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 263 Extreme Q / Shift+Q cycle favorite', () => {
  it('cycles indices, resolves hotkeys, and wires Face Live', () => {
    expect(cycleDisneyExtremeBaselineFavoriteIndex(null, 0)).toBe(null);
    expect(cycleDisneyExtremeBaselineFavoriteIndex(null, 3)).toBe(2);
    expect(cycleDisneyExtremeBaselineFavoriteIndex(null, 3, { prev: true })).toBe(
      0,
    );
    expect(cycleDisneyExtremeBaselineFavoriteIndex(2, 3)).toBe(0);
    expect(cycleDisneyExtremeBaselineFavoriteIndex(0, 3, { prev: true })).toBe(
      2,
    );
    expect(cycleDisneyExtremeBaselineFavoriteIndex(1, 3)).toBe(2);
    expect(matchDisneyExtremeHotkey('q')?.entry.id).toBe(
      'cycleBaselineFavoriteNext',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'q' }).action).toBe(
      'cycleBaselineFavoriteNext',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'q', shiftKey: true }).action,
    ).toBe('cycleBaselineFavoritePrev');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Q next fav');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+Q prev fav');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeNextFav');
    expect(src).toContain('btnDisneyExtremePrevFav');
    expect(src).toContain('function cycleDisneyExtremeBaselineFavorite');
    expect(src).toContain("resolved.action === 'cycleBaselineFavoriteNext'");
    expect(src).toContain("resolved.action === 'cycleBaselineFavoritePrev'");
    expect(typeof engine.cycleDisneyExtremeBaselineFavoriteIndex).toBe(
      'function',
    );
  });
});
