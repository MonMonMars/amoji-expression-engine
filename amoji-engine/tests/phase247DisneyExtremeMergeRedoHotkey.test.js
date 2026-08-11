import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineRedoPreviewLabel,
  buildDisneyExtremeLiveSnapshot,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 247 Extreme Alt+O merge redo', () => {
  it('resolves Alt+O merge and formats redo preview', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'o', altKey: true }).action,
    ).toBe('mergeBaselineRedoJson');
    expect(
      resolveDisneyExtremeHotkey({ key: 'o', shiftKey: true }).action,
    ).toBe('pasteBaselineRedoJson');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+O merge redo');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift merge hist/redo');
    expect(formatDisneyExtremeBaselineRedoPreviewLabel([])).toBe(
      'preview · redo · empty',
    );
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(formatDisneyExtremeBaselineRedoPreviewLabel([snap])).toContain(
      'preview · redo 1 · tip',
    );
    expect(typeof engine.formatDisneyExtremeBaselineRedoPreviewLabel).toBe(
      'function',
    );
  });
});
