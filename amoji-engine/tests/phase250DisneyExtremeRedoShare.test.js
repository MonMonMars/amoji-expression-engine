import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  DISNEY_EXTREME_REDO_HASH_PARAM,
  buildDisneyExtremeLiveSnapshot,
  encodeDisneyExtremeBaselineRedoHash,
  decodeDisneyExtremeBaselineRedoHash,
  buildDisneyExtremeBaselineRedoShareUrl,
  loadDisneyExtremeBaselineRedoFromHash,
  disneyExtremeSnapshotFingerprint,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 250 Extreme redo share URL #dxr= / Alt+Y', () => {
  it('round-trips dxr= hash and resolves Alt+Y', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const frag = encodeDisneyExtremeBaselineRedoHash([snap]);
    expect(frag.startsWith(`${DISNEY_EXTREME_REDO_HASH_PARAM}=`)).toBe(true);
    const decoded = decodeDisneyExtremeBaselineRedoHash(`#${frag}`);
    expect(decoded.ok).toBe(true);
    expect(decoded.redo).toHaveLength(1);
    expect(disneyExtremeSnapshotFingerprint(decoded.redo[0])).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(decodeDisneyExtremeBaselineRedoHash('#dxh=abc').error).toBe(
      'no_dxr',
    );
    const share = buildDisneyExtremeBaselineRedoShareUrl([snap], {
      baseUrl: 'https://example.test/face-live.html',
      mergeHash: false,
    });
    expect(share.url).toContain('#dxr=');
    expect(
      loadDisneyExtremeBaselineRedoFromHash({ hash: `#${frag}` }).ok,
    ).toBe(true);
    expect(
      resolveDisneyExtremeHotkey({ key: 'y', altKey: true }).action,
    ).toBe('copyBaselineRedoShareUrl');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+Y share redo');
    expect(typeof engine.buildDisneyExtremeBaselineRedoShareUrl).toBe(
      'function',
    );
  });
});
