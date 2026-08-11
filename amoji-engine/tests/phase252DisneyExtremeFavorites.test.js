import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  DISNEY_EXTREME_BASELINE_FAVORITES_LIMIT,
  buildDisneyExtremeLiveSnapshot,
  pushDisneyExtremeBaselineFavorite,
  formatDisneyExtremeBaselineFavoritesList,
  serializeDisneyExtremeBaselineFavorites,
  parseDisneyExtremeBaselineFavorites,
  saveDisneyExtremeBaselineFavorites,
  loadDisneyExtremeBaselineFavorites,
  clearDisneyExtremeBaselineFavoritesStorage,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 252 Extreme favorites S / Shift+S', () => {
  it('stars favorites, persists, and resolves hotkeys', () => {
    expect(matchDisneyExtremeHotkey('S')?.entry.id).toBe(
      'starBaselineFavorite',
    );
    expect(resolveDisneyExtremeHotkey({ key: 's' }).action).toBe(
      'starBaselineFavorite',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 's', shiftKey: true }).action,
    ).toBe('showBaselineFavorites');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('S star fav');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+S fav list');
    expect(DISNEY_EXTREME_BASELINE_FAVORITES_LIMIT).toBe(8);

    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.6,
      shapeFactor: 1.3,
      bodyOn: true,
      bodyFactor: 1.3,
      eyeFactor: 1.2,
      mouthFactor: 1.3,
    });
    const b = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.6,
      bodyOn: false,
      bodyFactor: 1.4,
      eyeFactor: 1.5,
      mouthFactor: 1.5,
    });
    let favs = pushDisneyExtremeBaselineFavorite([], a);
    favs = pushDisneyExtremeBaselineFavorite(favs, a);
    expect(favs).toHaveLength(1);
    favs = pushDisneyExtremeBaselineFavorite(favs, b);
    expect(favs).toHaveLength(2);
    expect(formatDisneyExtremeBaselineFavoritesList(favs)).toContain('fav 2');
    expect(formatDisneyExtremeBaselineFavoritesList(favs)).toContain('F#');

    const storage = new Map();
    const mem = {
      getItem: (k) => (storage.has(k) ? storage.get(k) : null),
      setItem: (k, v) => storage.set(k, String(v)),
      removeItem: (k) => storage.delete(k),
    };
    expect(saveDisneyExtremeBaselineFavorites(favs, { storage: mem }).ok).toBe(
      true,
    );
    expect(loadDisneyExtremeBaselineFavorites({ storage: mem })).toHaveLength(
      2,
    );
    const raw = serializeDisneyExtremeBaselineFavorites(favs);
    expect(parseDisneyExtremeBaselineFavorites(raw).ok).toBe(true);
    clearDisneyExtremeBaselineFavoritesStorage({ storage: mem });
    expect(loadDisneyExtremeBaselineFavorites({ storage: mem })).toHaveLength(
      0,
    );
    expect(typeof engine.pushDisneyExtremeBaselineFavorite).toBe('function');
  });
});
