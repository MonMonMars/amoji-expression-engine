import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 456 Extreme arrow cycle mirror buttons', () => {
  it('adds arrow mirror buttons for fav/hist/redo cycling', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'ArrowRight' }).action).toBe('cycleBaselineFavoriteNext');
    expect(resolveDisneyExtremeHotkey({ key: 'ArrowDown' }).action).toBe('cycleBaselineHistoryNext');
    expect(resolveDisneyExtremeHotkey({ key: 'ArrowDown', shiftKey: true }).action).toBe('cycleBaselineRedoNext');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('→/← cycle fav · button');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('↓/↑ cycle hist · button');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧↓/⇧↑ cycle redo · button');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="btnDisneyExtremeArrowFavNext"');
    expect(src).toContain('id="btnDisneyExtremeArrowHistNext"');
    expect(src).toContain('id="btnDisneyExtremeArrowRedoNext"');
    expect(src).toContain("getElementById('btnDisneyExtremeArrowFavNext')?.addEventListener('click'");
    expect(src).toContain("getElementById('btnDisneyExtremeArrowHistPrev')?.addEventListener('click'");
    expect(src).toContain("getElementById('btnDisneyExtremeArrowRedoPrev')?.addEventListener('click'");
  });
});
