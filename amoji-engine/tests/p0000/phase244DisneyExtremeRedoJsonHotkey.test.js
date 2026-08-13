import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 244 Extreme O / Shift+O redo JSON hotkeys', () => {
  it('resolves O copy and Shift+O paste redo JSON', () => {
    expect(matchDisneyExtremeHotkey('O')?.entry.id).toBe(
      'copyBaselineRedoJson',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'o' }).action).toBe(
      'copyBaselineRedoJson',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'o', shiftKey: true }).action,
    ).toBe('pasteBaselineRedoJson');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('O copy redo JSON');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+O paste redo');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+click chip diff');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
