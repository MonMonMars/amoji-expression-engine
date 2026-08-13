import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 327 Extreme 9 jump hist tip', () => {
  it('resolves 9 and wires Face Live jump to latest history', () => {
    expect(matchDisneyExtremeHotkey('9')?.entry.id).toBe(
      'jumpBaselineHistoryTip',
    );
    expect(resolveDisneyExtremeHotkey({ key: '9' }).action).toBe(
      'jumpBaselineHistoryTip',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: '9', shiftKey: true }).action,
    ).toBe('jumpBaselineRedoTip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('9 jump hist tip');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpHistTip');
    expect(src).toContain('function jumpDisneyExtremeBaselineHistoryTip');
    expect(src).toContain("resolved.action === 'jumpBaselineHistoryTip'");
    expect(src).toContain('jumpDisneyExtremeBaselineHistory(n - 1)');
  });
});
