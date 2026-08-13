import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineStacksSummaryLabel,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 284 Extreme Shift+Alt+L copy stacks summary', () => {
  it('resolves Shift+Alt+L and wires Face Live copy stacks summary', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'l',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyBaselineStacksSummary');
    expect(
      resolveDisneyExtremeHotkey({ key: 'l', altKey: true }).action,
    ).toBe('showBaselineStacks');
    expect(formatDisneyExtremeBaselineStacksSummaryLabel({})).toBe(
      'stacks · empty',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+L copy stacks');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyStacksSummary');
    expect(src).toContain('function copyDisneyExtremeBaselineStacksSummary');
    expect(src).toContain("resolved.action === 'copyBaselineStacksSummary'");
  });
});
