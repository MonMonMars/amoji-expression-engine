import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineRedoList,
  buildDisneyExtremeLiveSnapshot,
} from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 320 Extreme ⇧Alt+H copy redo list', () => {
  it('resolves ⇧Alt+H and wires Face Live redo list copy', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.7,
      shapeFactor: 1.25,
    });
    const label = formatDisneyExtremeBaselineRedoList([snap]);
    expect(label.startsWith('redo 1')).toBe(true);
    expect(
      resolveDisneyExtremeHotkey({
        key: 'h',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyBaselineRedoList');
    expect(
      resolveDisneyExtremeHotkey({ key: 'h', altKey: true }).action,
    ).toBe('copyHotkeyHelp');
    expect(
      resolveDisneyExtremeHotkey({ key: 'h', shiftKey: true }).action,
    ).toBe('copyBaselineHistoryList');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+H copy redo list');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyRedoList');
    expect(src).toContain('function copyDisneyExtremeBaselineRedoList');
    expect(src).toContain("resolved.action === 'copyBaselineRedoList'");
    expect(src).toContain('formatDisneyExtremeBaselineRedoList(');
  });
});
