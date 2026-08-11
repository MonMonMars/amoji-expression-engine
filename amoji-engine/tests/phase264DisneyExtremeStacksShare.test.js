import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  DISNEY_EXTREME_STACKS_HASH_PARAM,
  buildDisneyExtremeLiveSnapshot,
  encodeDisneyExtremeBaselineStacksHash,
  decodeDisneyExtremeBaselineStacksHash,
  buildDisneyExtremeBaselineStacksShareUrl,
  loadDisneyExtremeBaselineStacksFromHash,
  disneyExtremeSnapshotFingerprint,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 264 Extreme stacks share URL #dxb= / V', () => {
  it('round-trips dxb= hash, resolves V, and wires Face Live', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.9,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.45,
      mouthFactor: 1.55,
    });
    const frag = encodeDisneyExtremeBaselineStacksHash({
      history: [snap],
      redo: [snap],
      favorites: [snap],
    });
    expect(frag.startsWith(`${DISNEY_EXTREME_STACKS_HASH_PARAM}=`)).toBe(true);
    const decoded = decodeDisneyExtremeBaselineStacksHash(`#${frag}`);
    expect(decoded.ok).toBe(true);
    expect(decoded.history).toHaveLength(1);
    expect(decoded.redo).toHaveLength(1);
    expect(decoded.favorites).toHaveLength(1);
    expect(disneyExtremeSnapshotFingerprint(decoded.history[0])).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(decodeDisneyExtremeBaselineStacksHash('#dxf=abc').error).toBe(
      'no_dxb',
    );
    const share = buildDisneyExtremeBaselineStacksShareUrl(
      { history: [snap], favorites: [snap] },
      { baseUrl: 'https://example.test/face-live.html', mergeHash: false },
    );
    expect(share.url).toContain('#dxb=');
    expect(
      loadDisneyExtremeBaselineStacksFromHash({ hash: `#${frag}` }).ok,
    ).toBe(true);
    expect(matchDisneyExtremeHotkey('V')?.entry.id).toBe(
      'copyBaselineStacksShareUrl',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'v' }).action).toBe(
      'copyBaselineStacksShareUrl',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('V share stacks');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeShareStacks');
    expect(src).toContain('function copyDisneyExtremeBaselineStacksShareUrl');
    expect(src).toContain('applyDisneyExtremeBaselineStacksFromHash');
    expect(src).toContain(
      "resolved.action === 'copyBaselineStacksShareUrl'",
    );
    expect(typeof engine.buildDisneyExtremeBaselineStacksShareUrl).toBe(
      'function',
    );
  });
});
