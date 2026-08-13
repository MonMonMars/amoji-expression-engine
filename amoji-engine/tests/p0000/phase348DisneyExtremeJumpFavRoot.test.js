import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 348 Extreme ⇧Alt+/ jump fav root', () => {
  it('resolves ⇧Alt+/ and wires Face Live oldest favorite jump', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: '/',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('jumpBaselineFavoriteRoot');
    expect(
      resolveDisneyExtremeHotkey({ key: '/', altKey: true }).action,
    ).toBe('jumpBaselineRedoRoot');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+/ jump fav root');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpFavRoot');
    expect(src).toContain('function jumpDisneyExtremeBaselineFavoriteRoot');
    expect(src).toContain("resolved.action === 'jumpBaselineFavoriteRoot'");
    expect(src).toContain('jumpDisneyExtremeBaselineFavorite(0)');
  });
});
