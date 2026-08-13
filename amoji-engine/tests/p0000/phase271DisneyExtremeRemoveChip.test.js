import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  buildDisneyExtremeLiveSnapshot,
  removeDisneyExtremeBaselineStackEntry,
  disneyExtremeSnapshotFingerprint,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 271 Extreme Ctrl+click hist/redo chip remove', () => {
  it('removes stack entries and wires Face Live chip remove', () => {
    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.6,
      shapeFactor: 1.3,
      bodyOn: false,
      bodyFactor: 1.1,
      eyeFactor: 1.2,
      mouthFactor: 1.2,
    });
    const b = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const removed = removeDisneyExtremeBaselineStackEntry([a, b], 0);
    expect(removed.removed).toBe(true);
    expect(removed.items).toHaveLength(1);
    expect(disneyExtremeSnapshotFingerprint(removed.items[0])).toBe(
      disneyExtremeSnapshotFingerprint(b),
    );
    expect(removeDisneyExtremeBaselineStackEntry([a], 3).removed).toBe(false);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'Ctrl+click hist/redo chip remove',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function removeDisneyExtremeBaselineChipAt');
    expect(src).toContain(
      "ev.ctrlKey && (kind === 'hist' || kind === 'redo')",
    );
    expect(src).toContain('removeDisneyExtremeBaselineStackEntry');
    expect(typeof engine.removeDisneyExtremeBaselineStackEntry).toBe(
      'function',
    );
  });
});
