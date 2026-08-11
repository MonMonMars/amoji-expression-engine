import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineFavoritesBundle,
  buildDisneyExtremeLiveSnapshot,
} from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 324 Extreme ⇧Alt+G copy fav+json', () => {
  it('resolves ⇧Alt+G and wires Face Live favorites list+JSON bundle copy', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.2,
    });
    const text = formatDisneyExtremeBaselineFavoritesBundle([snap]);
    expect(text.startsWith('fav 1')).toBe(true);
    expect(text).toContain('"kind"');
    expect(
      resolveDisneyExtremeHotkey({
        key: 'g',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyBaselineFavoritesBundle');
    expect(
      resolveDisneyExtremeHotkey({ key: 'g', altKey: true }).action,
    ).toBe('mergeBaselineFavoritesJson');
    expect(
      resolveDisneyExtremeHotkey({ key: 'g', shiftKey: true }).action,
    ).toBe('pasteBaselineFavoritesJson');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+G copy fav+json');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyFavBundle');
    expect(src).toContain('function copyDisneyExtremeBaselineFavoritesBundle');
    expect(src).toContain("resolved.action === 'copyBaselineFavoritesBundle'");
    expect(src).toContain('formatDisneyExtremeBaselineFavoritesBundle(');
  });
});
