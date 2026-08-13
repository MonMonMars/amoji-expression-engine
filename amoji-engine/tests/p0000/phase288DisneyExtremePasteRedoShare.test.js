import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  buildDisneyExtremeLiveSnapshot,
  buildDisneyExtremeBaselineRedoShareUrl,
  decodeDisneyExtremeBaselineRedoHash,
  disneyExtremeSnapshotFingerprint,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 288 Extreme Shift+Alt+Y paste redo share', () => {
  it('decodes redo share URLs, resolves Shift+Alt+Y, and wires Face Live', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.66,
      shapeFactor: 1.38,
      bodyOn: true,
      bodyFactor: 1.28,
      eyeFactor: 1.22,
      mouthFactor: 1.31,
    });
    const share = buildDisneyExtremeBaselineRedoShareUrl([snap], {
      baseUrl: 'https://example.test/face-live.html',
      mergeHash: false,
    });
    const decoded = decodeDisneyExtremeBaselineRedoHash(share.url);
    expect(decoded.ok).toBe(true);
    expect(decoded.redo).toHaveLength(1);
    expect(disneyExtremeSnapshotFingerprint(decoded.redo[0])).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(
      resolveDisneyExtremeHotkey({
        key: 'y',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('pasteBaselineRedoShareUrl');
    expect(
      resolveDisneyExtremeHotkey({ key: 'y', altKey: true }).action,
    ).toBe('copyBaselineRedoShareUrl');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+Y paste redo');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremePasteRedoShare');
    expect(src).toContain('function pasteDisneyExtremeBaselineRedoShareUrl');
    expect(src).toContain("resolved.action === 'pasteBaselineRedoShareUrl'");
  });
});
