import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  buildDisneyExtremeLiveSnapshot,
  pushDisneyExtremeBaselineFavorite,
  removeDisneyExtremeBaselineFavorite,
  disneyExtremeSnapshotFingerprint,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 266 Extreme Alt+S unstar favorite', () => {
  it('removes by fingerprint, resolves Alt+S, and wires Face Live', () => {
    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.7,
      shapeFactor: 1.4,
      bodyOn: false,
      bodyFactor: 1.2,
      eyeFactor: 1.3,
      mouthFactor: 1.3,
    });
    const b = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.9,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.5,
      mouthFactor: 1.6,
    });
    let favs = [];
    favs = pushDisneyExtremeBaselineFavorite(favs, a);
    favs = pushDisneyExtremeBaselineFavorite(favs, b);
    expect(favs).toHaveLength(2);
    const removed = removeDisneyExtremeBaselineFavorite(favs, a);
    expect(removed.removed).toBe(true);
    expect(removed.favorites).toHaveLength(1);
    expect(disneyExtremeSnapshotFingerprint(removed.favorites[0])).toBe(
      disneyExtremeSnapshotFingerprint(b),
    );
    expect(
      removeDisneyExtremeBaselineFavorite(removed.favorites, a).removed,
    ).toBe(false);
    const byIndex = removeDisneyExtremeBaselineFavorite([a, b], null, {
      index: 1,
    });
    expect(byIndex.removed).toBe(true);
    expect(byIndex.favorites).toHaveLength(1);
    expect(
      resolveDisneyExtremeHotkey({ key: 's', altKey: true }).action,
    ).toBe('unstarBaselineFavorite');
    expect(resolveDisneyExtremeHotkey({ key: 's' }).action).toBe(
      'starBaselineFavorite',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+S unstar fav');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Ctrl+click fav chip unstar');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeUnstarFav');
    expect(src).toContain('function unstarDisneyExtremeBaselineFavorite');
    expect(src).toContain('function unstarDisneyExtremeBaselineFavoriteAt');
    expect(src).toContain("resolved.action === 'unstarBaselineFavorite'");
    expect(src).toContain('ev.ctrlKey && kind === \'fav\'');
    expect(typeof engine.removeDisneyExtremeBaselineFavorite).toBe('function');
  });
});
