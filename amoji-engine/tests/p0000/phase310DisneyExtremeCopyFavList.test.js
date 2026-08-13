import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineFavoritesList,
  buildDisneyExtremeLiveSnapshot,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 310 Extreme ⇧Alt+S copy fav list', () => {
  it('resolves ⇧Alt+S and wires Face Live favorites list copy', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.2,
    });
    const label = formatDisneyExtremeBaselineFavoritesList([snap]);
    expect(label.startsWith('fav 1')).toBe(true);
    expect(
      resolveDisneyExtremeHotkey({
        key: 's',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyBaselineFavoritesList');
    expect(
      resolveDisneyExtremeHotkey({ key: 's', altKey: true }).action,
    ).toBe('unstarBaselineFavorite');
    expect(
      resolveDisneyExtremeHotkey({ key: 's', shiftKey: true }).action,
    ).toBe('showBaselineFavorites');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+S copy fav list');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyFavList');
    expect(src).toContain('function copyDisneyExtremeBaselineFavoritesList');
    expect(src).toContain("resolved.action === 'copyBaselineFavoritesList'");
    expect(src).toContain(
      'formatDisneyExtremeBaselineFavoritesList(\n          extremeBaselineFavorites',
    );
  });
});
