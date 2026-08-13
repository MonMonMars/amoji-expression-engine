import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  DISNEY_EXTREME_FAVORITES_HASH_PARAM,
  buildDisneyExtremeLiveSnapshot,
  encodeDisneyExtremeBaselineFavoritesHash,
  decodeDisneyExtremeBaselineFavoritesHash,
  buildDisneyExtremeBaselineFavoritesShareUrl,
  loadDisneyExtremeBaselineFavoritesFromHash,
  disneyExtremeSnapshotFingerprint,
  matchDisneyExtremeHotkey,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 257 Extreme fav share URL #dxf= / T', () => {
  it('round-trips dxf= hash, resolves T, and wires Face Live', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.85,
      shapeFactor: 1.55,
      bodyOn: true,
      bodyFactor: 1.45,
      eyeFactor: 1.5,
      mouthFactor: 1.6,
    });
    const frag = encodeDisneyExtremeBaselineFavoritesHash([snap]);
    expect(frag.startsWith(`${DISNEY_EXTREME_FAVORITES_HASH_PARAM}=`)).toBe(
      true,
    );
    const decoded = decodeDisneyExtremeBaselineFavoritesHash(`#${frag}`);
    expect(decoded.ok).toBe(true);
    expect(decoded.favorites).toHaveLength(1);
    expect(disneyExtremeSnapshotFingerprint(decoded.favorites[0])).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(decodeDisneyExtremeBaselineFavoritesHash('#dxr=abc').error).toBe(
      'no_dxf',
    );
    const share = buildDisneyExtremeBaselineFavoritesShareUrl([snap], {
      baseUrl: 'https://example.test/face-live.html',
      mergeHash: false,
    });
    expect(share.url).toContain('#dxf=');
    expect(
      loadDisneyExtremeBaselineFavoritesFromHash({ hash: `#${frag}` }).ok,
    ).toBe(true);
    expect(matchDisneyExtremeHotkey('T')?.entry.id).toBe(
      'copyBaselineFavoritesShareUrl',
    );
    expect(resolveDisneyExtremeHotkey({ key: 't' }).action).toBe(
      'copyBaselineFavoritesShareUrl',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('T share fav');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeShareFav');
    expect(src).toContain('function copyDisneyExtremeBaselineFavoritesShareUrl');
    expect(src).toContain('applyDisneyExtremeBaselineFavoritesFromHash');
    expect(src).toContain(
      "resolved.action === 'copyBaselineFavoritesShareUrl'",
    );
    expect(typeof engine.buildDisneyExtremeBaselineFavoritesShareUrl).toBe(
      'function',
    );
  });
});
