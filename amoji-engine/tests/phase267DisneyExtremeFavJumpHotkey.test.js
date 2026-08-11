import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  disneyExtremeFavoriteJumpIndex,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 267 Extreme Alt+1–4 favorite jump', () => {
  it('maps Alt digits to fav jump and wires Face Live', () => {
    expect(disneyExtremeFavoriteJumpIndex('1')).toBe(0);
    expect(disneyExtremeFavoriteJumpIndex('4')).toBe(3);
    expect(disneyExtremeFavoriteJumpIndex('5')).toBe(null);
    expect(resolveDisneyExtremeHotkey({ key: '2', altKey: true })).toEqual({
      ok: true,
      action: 'jumpBaselineFavorite',
      index: 1,
    });
    expect(resolveDisneyExtremeHotkey({ key: '1' })).toEqual({
      ok: true,
      action: 'jumpBaselineHistory',
      index: 0,
    });
    expect(resolveDisneyExtremeHotkey({ key: '5', altKey: true }).ok).toBe(
      false,
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+1–4 fav jump');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain("resolved.action === 'jumpBaselineFavorite'");
    expect(src).toContain('jumpDisneyExtremeBaselineFavorite(resolved.index)');
    expect(typeof engine.disneyExtremeFavoriteJumpIndex).toBe('function');
  });
});
