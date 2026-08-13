import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  buildDisneyExtremeLiveSnapshot,
  buildDisneyExtremeSnapshotShareUrl,
  decodeDisneyExtremeSnapshotHash,
  disneyExtremeSnapshotFingerprint,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 289 Extreme Alt+J paste snap share', () => {
  it('decodes snap share URLs, resolves Alt+J, and wires Face Live', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.91,
      shapeFactor: 1.52,
      bodyOn: true,
      bodyFactor: 1.41,
      eyeFactor: 1.48,
      mouthFactor: 1.57,
    });
    const share = buildDisneyExtremeSnapshotShareUrl(snap, {
      baseUrl: 'https://example.test/face-live.html',
      mergeHash: false,
    });
    const decoded = decodeDisneyExtremeSnapshotHash(share.url);
    expect(decoded.ok).toBe(true);
    expect(disneyExtremeSnapshotFingerprint(decoded.snap)).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'j', altKey: true }).action,
    ).toBe('pasteSnapshotShareUrl');
    expect(resolveDisneyExtremeHotkey({ key: 'j' }).action).toBe(
      'copySnapshotJson',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'j', shiftKey: true }).action,
    ).toBe('pasteSnapshotJson');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+J paste snap');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremePasteSnapShare');
    expect(src).toContain('function pasteDisneyExtremeSnapshotShareUrl');
    expect(src).toContain("resolved.action === 'pasteSnapshotShareUrl'");
    expect(src).toContain('pasted · snap share');
  });
});
