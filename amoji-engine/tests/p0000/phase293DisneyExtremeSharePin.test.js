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

describe('Phase 293 Extreme Alt+C share pin', () => {
  it('resolves Alt+C and wires Face Live pin share copy', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.77,
      shapeFactor: 1.44,
      bodyOn: true,
      bodyFactor: 1.33,
      eyeFactor: 1.29,
      mouthFactor: 1.36,
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
      resolveDisneyExtremeHotkey({ key: 'c', altKey: true }).action,
    ).toBe('copyBaselinePinShareUrl');
    expect(resolveDisneyExtremeHotkey({ key: 'c' }).action).toBe(
      'copySummary',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'c', shiftKey: true }).action,
    ).toBe('copySnapshotDiff');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+C share pin');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeSharePin');
    expect(src).toContain('function copyDisneyExtremeBaselinePinShareUrl');
    expect(src).toContain("resolved.action === 'copyBaselinePinShareUrl'");
    expect(src).toMatch(
      /copyDisneyExtremeBaselinePinShareUrl[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: `pin share · fp \$\{fp\}`/,
    );
    expect(src).toContain('share pin · none');
  });
});
