import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineRootsLabel,
  buildDisneyExtremeLiveSnapshot,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 343 Extreme Shift+\\ copy roots', () => {
  it('resolves Shift+\\ / | and wires Face Live roots clipboard copy', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.55,
      shapeFactor: 1.2,
    });
    const text = formatDisneyExtremeBaselineRootsLabel({
      history: [snap],
      redo: [],
      favorites: [snap],
    });
    expect(text).toContain('roots ·');
    expect(text).toContain('hist ·');
    expect(text).toContain('redo · empty');
    expect(text).toContain('fav ·');
    expect(
      resolveDisneyExtremeHotkey({ key: '\\', shiftKey: true }).action,
    ).toBe('copyBaselineRoots');
    expect(resolveDisneyExtremeHotkey({ key: '|' }).action).toBe(
      'copyBaselineRoots',
    );
    expect(resolveDisneyExtremeHotkey({ key: '\\' }).action).toBe(
      'showBaselineRoots',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+\\ copy roots');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyRoots');
    expect(src).toContain('function copyDisneyExtremeBaselineRoots');
    expect(src).toContain("resolved.action === 'copyBaselineRoots'");
  });
});
