import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 332 Extreme ⇧Alt+9 jump redo tip summary', () => {
  it('resolves ⇧Alt+9 and wires Face Live redo tip jump+summary', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: '9',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('jumpBaselineRedoTipSummary');
    expect(
      resolveDisneyExtremeHotkey({ key: '9', altKey: true }).action,
    ).toBe('jumpBaselineHistoryTipSummary');
    expect(
      resolveDisneyExtremeHotkey({ key: '9', shiftKey: true }).action,
    ).toBe('jumpBaselineRedoTip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      '⇧Alt+9 jump redo tip summary',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpRedoTipSummary');
    expect(src).toContain('function jumpDisneyExtremeBaselineRedoTipSummary');
    expect(src).toContain(
      "resolved.action === 'jumpBaselineRedoTipSummary'",
    );
    expect(src).toContain('jumpDisneyExtremeBaselineRedo(n - 1)');
  });
});
