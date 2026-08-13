import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  buildDisneyExtremeLiveSnapshot,
  buildDisneyExtremeBaselineKitShareUrl,
  decodeDisneyExtremeBaselineKitHash,
  formatDisneyExtremeBaselineKitPreviewLabel,
  disneyExtremeSnapshotFingerprint,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 276 Extreme Alt+V paste kit share', () => {
  it('decodes kit URLs, resolves Alt+V, and wires Face Live', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.82,
      shapeFactor: 1.48,
      bodyOn: true,
      bodyFactor: 1.38,
      eyeFactor: 1.42,
      mouthFactor: 1.52,
    });
    const share = buildDisneyExtremeBaselineKitShareUrl(
      {
        snap,
        history: [snap],
        redo: [],
        favorites: [snap],
      },
      { baseUrl: 'https://example.test/face-live.html', mergeHash: false },
    );
    const kit = decodeDisneyExtremeBaselineKitHash(share.url);
    expect(kit.ok).toBe(true);
    expect(kit.hasSnap).toBe(true);
    expect(kit.hasStacks).toBe(true);
    expect(disneyExtremeSnapshotFingerprint(kit.snap)).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(kit.history).toHaveLength(1);
    expect(kit.favorites).toHaveLength(1);
    expect(decodeDisneyExtremeBaselineKitHash('#flp=x').error).toBe('no_kit');
    expect(formatDisneyExtremeBaselineKitPreviewLabel(kit)).toContain(
      'preview · kit · snap',
    );
    expect(formatDisneyExtremeBaselineKitPreviewLabel(kit)).toContain(
      'hist 1 · redo 0 · fav 1',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'v', altKey: true }).action,
    ).toBe('pasteBaselineKitShareUrl');
    expect(resolveDisneyExtremeHotkey({ key: 'v' }).action).toBe(
      'copyBaselineStacksShareUrl',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+V paste kit');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremePasteKit');
    expect(src).toContain('function pasteDisneyExtremeBaselineKitShareUrl');
    expect(src).toContain("resolved.action === 'pasteBaselineKitShareUrl'");
    expect(typeof engine.decodeDisneyExtremeBaselineKitHash).toBe('function');
    expect(typeof engine.formatDisneyExtremeBaselineKitPreviewLabel).toBe(
      'function',
    );
  });
});
