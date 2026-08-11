import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  DISNEY_EXTREME_HISTORY_HASH_PARAM,
  buildDisneyExtremeLiveSnapshot,
  encodeDisneyExtremeBaselineHistoryHash,
  decodeDisneyExtremeBaselineHistoryHash,
  buildDisneyExtremeBaselineHistoryShareUrl,
  loadDisneyExtremeBaselineHistoryFromHash,
  disneyExtremeSnapshotFingerprint,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 249 Extreme hist share URL #dxh= / Shift+Y', () => {
  it('round-trips dxh= hash, resolves Shift+Y, and wires Face Live', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.75,
      shapeFactor: 1.55,
      bodyOn: true,
      bodyFactor: 1.45,
      eyeFactor: 1.5,
      mouthFactor: 1.6,
    });
    const frag = encodeDisneyExtremeBaselineHistoryHash([snap]);
    expect(frag.startsWith(`${DISNEY_EXTREME_HISTORY_HASH_PARAM}=`)).toBe(
      true,
    );
    const decoded = decodeDisneyExtremeBaselineHistoryHash(`#${frag}`);
    expect(decoded.ok).toBe(true);
    expect(decoded.history).toHaveLength(1);
    expect(disneyExtremeSnapshotFingerprint(decoded.history[0])).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(decodeDisneyExtremeBaselineHistoryHash('#dxs=abc').error).toBe(
      'no_dxh',
    );

    const share = buildDisneyExtremeBaselineHistoryShareUrl([snap], {
      baseUrl: 'https://example.test/face-live.html',
      mergeHash: false,
    });
    expect(share.url).toContain('#dxh=');
    expect(
      loadDisneyExtremeBaselineHistoryFromHash({ hash: `#${frag}` }).ok,
    ).toBe(true);

    expect(
      resolveDisneyExtremeHotkey({ key: 'y', shiftKey: true }).action,
    ).toBe('copyBaselineHistoryShareUrl');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+Y share hist');

    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeShareHist');
    expect(src).toContain('btnDisneyExtremeWipeRedo');
    expect(src).toContain('btnDisneyExtremeMergeRedo');
    expect(src).toContain("resolved.action === 'clearBaselineRedo'");
    expect(src).toContain("resolved.action === 'mergeBaselineRedoJson'");
    expect(src).toContain("resolved.action === 'copyBaselineHistoryShareUrl'");
    expect(src).toContain('applyDisneyExtremeBaselineHistoryFromHash');
    expect(src).toContain('wiped · redo');
    expect(src).toContain('${verb} · redo');
    expect(typeof engine.buildDisneyExtremeBaselineHistoryShareUrl).toBe(
      'function',
    );
  });
});
