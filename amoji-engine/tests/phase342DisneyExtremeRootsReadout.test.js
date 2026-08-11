import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineRootsLabel,
  formatDisneyExtremeBaselineHistoryEntry,
  buildDisneyExtremeLiveSnapshot,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 342 Extreme \\ roots readout', () => {
  it('formats roots label, resolves \\, and wires Face Live flash', () => {
    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.3,
      shapeFactor: 1.1,
    });
    const b = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.9,
      shapeFactor: 1.5,
    });
    const label = formatDisneyExtremeBaselineRootsLabel({
      history: [a, b],
      redo: [b],
      favorites: [],
    });
    expect(label.startsWith('roots ·')).toBe(true);
    expect(label).toContain('hist ·');
    expect(label).toContain(
      formatDisneyExtremeBaselineHistoryEntry(a, {
        index: 1,
        compact: true,
      }),
    );
    expect(label).not.toContain(
      formatDisneyExtremeBaselineHistoryEntry(b, {
        index: 2,
        compact: true,
      }),
    );
    expect(label).toContain('redo ·');
    expect(label).toContain('fav · empty');
    expect(resolveDisneyExtremeHotkey({ key: '\\' }).action).toBe(
      'showBaselineRoots',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: '|', shiftKey: true }).action,
    ).toBe('copyBaselineRoots');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('\\ roots readout');
    expect(typeof engine.formatDisneyExtremeBaselineRootsLabel).toBe(
      'function',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeRoots');
    expect(src).toContain('function flashDisneyExtremeBaselineRoots');
    expect(src).toContain("resolved.action === 'showBaselineRoots'");
    expect(src).toContain('formatDisneyExtremeBaselineRootsLabel(');
  });
});
