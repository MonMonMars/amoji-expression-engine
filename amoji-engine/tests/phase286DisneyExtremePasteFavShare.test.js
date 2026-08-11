import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  buildDisneyExtremeLiveSnapshot,
  buildDisneyExtremeBaselineFavoritesShareUrl,
  decodeDisneyExtremeBaselineFavoritesHash,
  disneyExtremeSnapshotFingerprint,
} from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 286 Extreme Alt+F paste fav share', () => {
  it('decodes fav share URLs, resolves Alt+F, and wires Face Live', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.4,
      bodyOn: true,
      bodyFactor: 1.3,
      eyeFactor: 1.35,
      mouthFactor: 1.45,
    });
    const share = buildDisneyExtremeBaselineFavoritesShareUrl([snap], {
      baseUrl: 'https://example.test/face-live.html',
      mergeHash: false,
    });
    const decoded = decodeDisneyExtremeBaselineFavoritesHash(share.url);
    expect(decoded.ok).toBe(true);
    expect(decoded.favorites).toHaveLength(1);
    expect(disneyExtremeSnapshotFingerprint(decoded.favorites[0])).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'f', altKey: true }).action,
    ).toBe('pasteBaselineFavoritesShareUrl');
    expect(resolveDisneyExtremeHotkey({ key: 'f' }).action).toBe(
      'showFactorBars',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+F paste fav');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremePasteFavShare');
    expect(src).toContain('function pasteDisneyExtremeBaselineFavoritesShareUrl');
    expect(src).toContain(
      "resolved.action === 'pasteBaselineFavoritesShareUrl'",
    );
  });
});
