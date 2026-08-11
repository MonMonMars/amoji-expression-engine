import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 331 Extreme Alt+9 jump hist tip summary', () => {
  it('resolves Alt+9 and wires Face Live hist tip jump+summary', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: '9', altKey: true }).action,
    ).toBe('jumpBaselineHistoryTipSummary');
    expect(resolveDisneyExtremeHotkey({ key: '9' }).action).toBe(
      'jumpBaselineHistoryTip',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: '9', shiftKey: true }).action,
    ).toBe('jumpBaselineRedoTip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'Alt+9 jump hist tip summary',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpHistTipSummary');
    expect(src).toContain(
      'function jumpDisneyExtremeBaselineHistoryTipSummary',
    );
    expect(src).toContain(
      "resolved.action === 'jumpBaselineHistoryTipSummary'",
    );
    expect(src).toContain('jumpDisneyExtremeBaselineHistory(n - 1)');
  });
});
