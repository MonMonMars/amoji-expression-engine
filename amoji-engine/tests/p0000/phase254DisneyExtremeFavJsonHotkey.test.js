import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
  formatDisneyExtremeBaselineFavoritesPreviewLabel,
  buildDisneyExtremeLiveSnapshot,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 254 Extreme G / Shift+G / Alt+G favorites JSON', () => {
  it('resolves fav JSON hotkeys and formats preview', () => {
    expect(matchDisneyExtremeHotkey('G')?.entry.id).toBe(
      'copyBaselineFavoritesJson',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'g' }).action).toBe(
      'copyBaselineFavoritesJson',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'g', shiftKey: true }).action,
    ).toBe('pasteBaselineFavoritesJson');
    expect(
      resolveDisneyExtremeHotkey({ key: 'g', altKey: true }).action,
    ).toBe('mergeBaselineFavoritesJson');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('G copy fav JSON');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+G paste fav');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+G merge fav');
    expect(formatDisneyExtremeBaselineFavoritesPreviewLabel([])).toBe(
      'preview · fav · empty',
    );
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.7,
      shapeFactor: 1.4,
      bodyOn: true,
      bodyFactor: 1.3,
      eyeFactor: 1.3,
      mouthFactor: 1.4,
    });
    expect(
      formatDisneyExtremeBaselineFavoritesPreviewLabel([snap]),
    ).toContain('preview · fav 1 · tip');
    expect(typeof engine.formatDisneyExtremeBaselineFavoritesPreviewLabel).toBe(
      'function',
    );
  });
});
