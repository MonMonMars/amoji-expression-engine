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

describe('Phase 306 Extreme ⇧Alt+J paste snap live', () => {
  it('resolves ⇧Alt+J and wires Face Live apply-only snap paste', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.66,
      shapeFactor: 1.35,
      bodyOn: false,
      eyeFactor: 1.12,
      mouthFactor: 1.19,
    });
    const share = buildDisneyExtremeSnapshotShareUrl(snap, {
      baseUrl: 'https://example.test/face-live.html',
      mergeHash: false,
    });
    expect(decodeDisneyExtremeSnapshotHash(share.url).ok).toBe(true);
    expect(
      disneyExtremeSnapshotFingerprint(
        decodeDisneyExtremeSnapshotHash(share.url).snap,
      ),
    ).toBe(disneyExtremeSnapshotFingerprint(snap));
    expect(
      resolveDisneyExtremeHotkey({
        key: 'j',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('pasteSnapshotShareUrlLive');
    expect(
      resolveDisneyExtremeHotkey({ key: 'j', altKey: true }).action,
    ).toBe('pasteSnapshotShareUrl');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+J paste snap live');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremePasteSnapLive');
    expect(src).toContain("pasteDisneyExtremeSnapshotShareUrl({ liveOnly: true })");
    expect(src).toContain("resolved.action === 'pasteSnapshotShareUrlLive'");
    expect(src).toContain('pasted · snap live · fp');
  });
});
