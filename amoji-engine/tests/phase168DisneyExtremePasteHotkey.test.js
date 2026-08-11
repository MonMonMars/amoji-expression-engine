import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 168 Extreme Shift+J paste snapshot JSON', () => {
  it('resolves Shift+J to pasteSnapshotJson', () => {
    expect(matchDisneyExtremeHotkey('J')?.entry.id).toBe('copySnapshotJson');
    expect(resolveDisneyExtremeHotkey({ key: 'j' }).action).toBe(
      'copySnapshotJson',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'j', shiftKey: true }).action,
    ).toBe('pasteSnapshotJson');
    expect(
      resolveDisneyExtremeHotkey({ key: 'J', shiftKey: true }).action,
    ).toBe('pasteSnapshotJson');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+J paste json');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
