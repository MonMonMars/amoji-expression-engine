import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  buildDisneyExtremeLiveSnapshot,
  buildDisneyExtremeSnapshotShareUrl,
  decodeDisneyExtremeSnapshotHash,
  disneyExtremeSnapshotFingerprint,
} from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 305 Extreme ⇧Alt+C paste pin share', () => {
  it('resolves ⇧Alt+C and wires Face Live pin-only share paste', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.71,
      shapeFactor: 1.41,
      bodyOn: true,
      bodyFactor: 1.22,
      eyeFactor: 1.18,
      mouthFactor: 1.27,
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
      resolveDisneyExtremeHotkey({
        key: 'c',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('pasteBaselinePinShareUrl');
    expect(
      resolveDisneyExtremeHotkey({ key: 'c', altKey: true }).action,
    ).toBe('copyBaselinePinShareUrl');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+C paste pin');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremePastePinShare');
    expect(src).toContain('function pasteDisneyExtremeBaselinePinShareUrl');
    expect(src).toContain("resolved.action === 'pasteBaselinePinShareUrl'");
    expect(src).toContain('pasted · pin · fp');
    expect(src).toContain('setDisneyExtremeBaseline(decoded.snap)');
    expect(src).not.toMatch(
      /pasteDisneyExtremeBaselinePinShareUrl[\s\S]{0,400}applyDisneyExtremeSnapshot\(decoded\.snap/,
    );
  });
});
