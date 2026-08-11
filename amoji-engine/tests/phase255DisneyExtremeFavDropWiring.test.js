import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 255 Extreme favorites drop + preview wiring', () => {
  it('wires fav JSON drop/merge and More IO buttons', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('parseDisneyExtremeBaselineFavorites');
    expect(src).toContain('formatDisneyExtremeBaselineFavoritesPreviewLabel');
    expect(src).toContain('function applyDisneyExtremeBaselineFavorites');
    expect(src).toContain('function copyDisneyExtremeBaselineFavoritesJson');
    expect(src).toContain('function pasteDisneyExtremeBaselineFavoritesJson');
    expect(src).toContain('btnDisneyExtremeCopyFav');
    expect(src).toContain('btnDisneyExtremePasteFav');
    expect(src).toContain('btnDisneyExtremeMergeFav');
    expect(src).toContain("resolved.action === 'copyBaselineFavoritesJson'");
    expect(src).toContain("resolved.action === 'pasteBaselineFavoritesJson'");
    expect(src).toContain("resolved.action === 'mergeBaselineFavoritesJson'");
    expect(src).toContain('${verb} · fav');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'drop JSON · hist/redo/fav/stacks/snap',
    );
  });
});
