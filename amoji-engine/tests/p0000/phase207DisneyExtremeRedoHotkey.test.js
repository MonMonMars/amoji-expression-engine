import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 207 Extreme Shift+U redo baseline', () => {
  it('resolves Shift+U to redoBaseline', () => {
    expect(matchDisneyExtremeHotkey('U')?.entry.id).toBe('undoBaseline');
    expect(
      resolveDisneyExtremeHotkey({ key: 'u', shiftKey: true }).action,
    ).toBe('redoBaseline');
    expect(resolveDisneyExtremeHotkey({ key: 'u' }).action).toBe(
      'undoBaseline',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+U redo base');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
