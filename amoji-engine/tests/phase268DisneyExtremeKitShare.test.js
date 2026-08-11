import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  buildDisneyExtremeLiveSnapshot,
  buildDisneyExtremeBaselineKitShareUrl,
  loadDisneyExtremeSnapshotFromHash,
  loadDisneyExtremeBaselineStacksFromHash,
  disneyExtremeSnapshotFingerprint,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 268 Extreme kit share URL Shift+V', () => {
  it('builds dxs+dxb kit URL, resolves Shift+V, and wires Face Live', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.88,
      shapeFactor: 1.52,
      bodyOn: true,
      bodyFactor: 1.42,
      eyeFactor: 1.48,
      mouthFactor: 1.58,
    });
    const share = buildDisneyExtremeBaselineKitShareUrl(
      {
        snap,
        history: [snap],
        redo: [],
        favorites: [snap],
      },
      { baseUrl: 'https://example.test/face-live.html', mergeHash: false },
    );
    expect(share.url).toContain('#dxs=');
    expect(share.url).toContain('&dxb=');
    const hash = `#${share.hash}`;
    const loadedSnap = loadDisneyExtremeSnapshotFromHash({ hash });
    expect(loadedSnap.ok).toBe(true);
    expect(disneyExtremeSnapshotFingerprint(loadedSnap.snap)).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    const loadedStacks = loadDisneyExtremeBaselineStacksFromHash({ hash });
    expect(loadedStacks.ok).toBe(true);
    expect(loadedStacks.history).toHaveLength(1);
    expect(loadedStacks.favorites).toHaveLength(1);
    expect(matchDisneyExtremeHotkey('V')?.entry.id).toBe(
      'copyBaselineStacksShareUrl',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'v' }).action).toBe(
      'copyBaselineStacksShareUrl',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'v', shiftKey: true }).action,
    ).toBe('copyBaselineKitShareUrl');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+V share kit');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeShareKit');
    expect(src).toContain('function copyDisneyExtremeBaselineKitShareUrl');
    expect(src).toContain("resolved.action === 'copyBaselineKitShareUrl'");
    expect(typeof engine.buildDisneyExtremeBaselineKitShareUrl).toBe(
      'function',
    );
  });
});
