import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineHistoryList,
  buildDisneyExtremeLiveSnapshot,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 316 Extreme Shift+H copy hist list', () => {
  it('resolves Shift+H and wires Face Live history list copy', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.7,
      shapeFactor: 1.25,
    });
    const label = formatDisneyExtremeBaselineHistoryList([snap], { redo: [] });
    expect(label.startsWith('hist 1')).toBe(true);
    expect(
      resolveDisneyExtremeHotkey({ key: 'h', shiftKey: true }).action,
    ).toBe('copyBaselineHistoryList');
    expect(resolveDisneyExtremeHotkey({ key: 'h' }).action).toBe('showHelp');
    expect(
      resolveDisneyExtremeHotkey({ key: 'h', altKey: true }).action,
    ).toBe('copyHotkeyHelp');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+H copy hist list');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyHistList');
    expect(src).toContain('function copyDisneyExtremeBaselineHistoryList');
    expect(src).toContain("resolved.action === 'copyBaselineHistoryList'");
    expect(src).toContain('formatDisneyExtremeBaselineHistoryList(');
  });
});
