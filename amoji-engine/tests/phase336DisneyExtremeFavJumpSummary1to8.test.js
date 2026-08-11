import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 336 Extreme ⇧Alt+1–8 fav jump summary range', () => {
  it('resolves ⇧Alt+5–8 fav jump summaries after capacity expand', () => {
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
        key: '8',
        altKey: true,
        shiftKey: true,
      }),
    ).toEqual({
      ok: true,
      action: 'jumpBaselineFavoriteSummary',
      index: 7,
    });
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      '⇧Alt+1–8 fav jump summary',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).not.toContain(
      '⇧Alt+1–4 fav jump summary',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('<kbd>⇧Alt+1–8</kbd>');
  });
});
