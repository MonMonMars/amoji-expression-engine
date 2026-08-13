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

describe('Phase 333 Extreme Alt+0 tips readout', () => {
  it('resolves Alt+0 and wires Face Live tips status flash', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.7,
      shapeFactor: 1.2,
    });
    const label = formatDisneyExtremeBaselineTipsLabel({
      history: [snap],
      redo: [],
      favorites: [snap],
    });
    expect(label.startsWith('tips ·')).toBe(true);
    expect(label).toContain('hist');
    expect(label).toContain('redo · empty');
    expect(label).toContain('fav');
    expect(
      resolveDisneyExtremeHotkey({ key: '0', altKey: true }).action,
    ).toBe('showBaselineTips');
    expect(resolveDisneyExtremeHotkey({ key: '0' }).action).toBe(
      'jumpBaselineFavoriteTip',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+0 tips readout');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeTips');
    expect(src).toContain('function flashDisneyExtremeBaselineTips');
    expect(src).toContain("resolved.action === 'showBaselineTips'");
    expect(src).toContain('formatDisneyExtremeBaselineTipsLabel(');
  });
});
