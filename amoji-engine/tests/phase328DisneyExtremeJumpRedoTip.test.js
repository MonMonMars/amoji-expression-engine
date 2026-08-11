import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 328 Extreme Shift+9 jump redo tip', () => {
  it('resolves Shift+9 and wires Face Live jump to latest redo', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: '9', shiftKey: true }).action,
    ).toBe('jumpBaselineRedoTip');
    expect(resolveDisneyExtremeHotkey({ key: '9' }).action).toBe(
      'jumpBaselineHistoryTip',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+9 jump redo tip');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpRedoTip');
    expect(src).toContain('function jumpDisneyExtremeBaselineRedoTip');
    expect(src).toContain("resolved.action === 'jumpBaselineRedoTip'");
    expect(src).toContain('jumpDisneyExtremeBaselineRedo(n - 1)');
  });
});
