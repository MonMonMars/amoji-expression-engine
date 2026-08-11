import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 187 Extreme Shift+C copy snapshot diff', () => {
  it('resolves Shift+C to copySnapshotDiff', () => {
    expect(matchDisneyExtremeHotkey('C')?.entry.id).toBe('copySummary');
    expect(resolveDisneyExtremeHotkey({ key: 'c' }).action).toBe('copySummary');
    expect(
      resolveDisneyExtremeHotkey({ key: 'c', shiftKey: true }).action,
    ).toBe('copySnapshotDiff');
    expect(
      resolveDisneyExtremeHotkey({ key: 'C', shiftKey: true }).action,
    ).toBe('copySnapshotDiff');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+C copy diff');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });
});
