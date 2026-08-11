import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  buildDisneyExtremeLiveSnapshot,
  encodeDisneyExtremeBaselineStacksHash,
  decodeDisneyExtremeBaselineStacksHash,
  buildDisneyExtremeBaselineStacksShareUrl,
  disneyExtremeSnapshotFingerprint,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 285 Extreme Alt+B paste stacks share', () => {
  it('decodes stacks URLs, resolves Alt+B, and wires Face Live', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.7,
      shapeFactor: 1.35,
      bodyOn: true,
      bodyFactor: 1.25,
      eyeFactor: 1.3,
      mouthFactor: 1.4,
    });
    const frag = encodeDisneyExtremeBaselineStacksHash({
      history: [snap],
      redo: [],
      favorites: [snap],
    });
    const share = buildDisneyExtremeBaselineStacksShareUrl(
      { history: [snap], favorites: [snap] },
      { baseUrl: 'https://example.test/face-live.html', mergeHash: false },
    );
    const decoded = decodeDisneyExtremeBaselineStacksHash(share.url);
    expect(decoded.ok).toBe(true);
    expect(decoded.history).toHaveLength(1);
    expect(decoded.favorites).toHaveLength(1);
    expect(disneyExtremeSnapshotFingerprint(decoded.history[0])).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(decodeDisneyExtremeBaselineStacksHash(`#${frag}`).ok).toBe(true);
    expect(decodeDisneyExtremeBaselineStacksHash('#dxf=abc').error).toBe(
      'no_dxb',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'b', altKey: true }).action,
    ).toBe('pasteBaselineStacksShareUrl');
    expect(resolveDisneyExtremeHotkey({ key: 'b' }).action).toBe(
      'toggleBodyApply',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+B paste stacks');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremePasteStacksShare');
    expect(src).toContain('function pasteDisneyExtremeBaselineStacksShareUrl');
    expect(src).toContain("resolved.action === 'pasteBaselineStacksShareUrl'");
    expect(src).toContain('decodeDisneyExtremeBaselineStacksHash');
    expect(typeof engine.decodeDisneyExtremeBaselineStacksHash).toBe(
      'function',
    );
  });
});
