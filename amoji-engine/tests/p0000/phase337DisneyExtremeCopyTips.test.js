import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineTipsLabel,
  buildDisneyExtremeLiveSnapshot,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 337 Extreme ⇧Alt+0 copy tips', () => {
  it('resolves ⇧Alt+0 and wires Face Live tips clipboard copy', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.55,
      shapeFactor: 1.15,
    });
    const text = formatDisneyExtremeBaselineTipsLabel({
      history: [snap],
      redo: [snap],
      favorites: [],
    });
    expect(text).toContain('tips ·');
    expect(text).toContain('hist ·');
    expect(text).toContain('redo ·');
    expect(text).toContain('fav · empty');
    expect(
      resolveDisneyExtremeHotkey({
        key: '0',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyBaselineTips');
    expect(
      resolveDisneyExtremeHotkey({ key: '0', altKey: true }).action,
    ).toBe('showBaselineTips');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+0 copy tips');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyTips');
    expect(src).toContain('function copyDisneyExtremeBaselineTips');
    expect(src).toContain("resolved.action === 'copyBaselineTips'");
    expect(src).toContain('formatDisneyExtremeBaselineTipsLabel(');
  });
});
