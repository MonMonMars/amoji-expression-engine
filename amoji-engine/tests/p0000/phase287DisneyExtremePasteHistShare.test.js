import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  buildDisneyExtremeLiveSnapshot,
  buildDisneyExtremeBaselineHistoryShareUrl,
  decodeDisneyExtremeBaselineHistoryHash,
  disneyExtremeSnapshotFingerprint,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 287 Extreme Alt+I paste hist share', () => {
  it('decodes hist share URLs, resolves Alt+I, and wires Face Live', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.72,
      shapeFactor: 1.42,
      bodyOn: false,
      bodyFactor: 1.2,
      eyeFactor: 1.25,
      mouthFactor: 1.33,
    });
    const share = buildDisneyExtremeBaselineHistoryShareUrl([snap], {
      baseUrl: 'https://example.test/face-live.html',
      mergeHash: false,
    });
    const decoded = decodeDisneyExtremeBaselineHistoryHash(share.url);
    expect(decoded.ok).toBe(true);
    expect(decoded.history).toHaveLength(1);
    expect(disneyExtremeSnapshotFingerprint(decoded.history[0])).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'i', altKey: true }).action,
    ).toBe('pasteBaselineHistoryShareUrl');
    expect(resolveDisneyExtremeHotkey({ key: 'i' }).action).toBe(
      'pasteBaselineHistoryJson',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+I paste hist share');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremePasteHistShare');
    expect(src).toContain('function pasteDisneyExtremeBaselineHistoryShareUrl');
    expect(src).toContain(
      "resolved.action === 'pasteBaselineHistoryShareUrl'",
    );
  });
});
