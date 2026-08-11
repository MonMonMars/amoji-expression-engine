import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 326 Extreme ⇧Alt+1–8 fav jump summary', () => {
  it('resolves ⇧Alt+1–8 and wires Face Live fav jump+summary', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: '2',
        altKey: true,
        shiftKey: true,
      }),
    ).toEqual({
      ok: true,
      action: 'jumpBaselineFavoriteSummary',
      index: 1,
    });
    expect(
      resolveDisneyExtremeHotkey({ key: '2', altKey: true }),
    ).toEqual({
      ok: true,
      action: 'jumpBaselineFavorite',
      index: 1,
    });
    expect(
      resolveDisneyExtremeHotkey({
        key: '5',
        altKey: true,
        shiftKey: true,
      }),
    ).toEqual({
      ok: true,
      action: 'jumpBaselineFavoriteSummary',
      index: 4,
    });
    expect(
      resolveDisneyExtremeHotkey({
        key: '9',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('jumpBaselineRedoTipSummary');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      '⇧Alt+1–8 fav jump summary',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpFavSummary');
    expect(src).toContain('function jumpDisneyExtremeBaselineFavoriteSummary');
    expect(src).toContain(
      "resolved.action === 'jumpBaselineFavoriteSummary'",
    );
    expect(src).toContain('jumpDisneyExtremeBaselineFavorite(index)');
    expect(src).toContain('formatDisneyExtremeBaselineHistoryEntry(snap,');
  });
});
