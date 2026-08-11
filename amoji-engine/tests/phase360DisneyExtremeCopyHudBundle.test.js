import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 360 Extreme ⇧Alt+Enter copy hud', () => {
  it('resolves ⇧Alt+Enter and wires Face Live HUD clipboard copy', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'Enter',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyBaselineHudBundle');
    expect(
      resolveDisneyExtremeHotkey({ key: 'Enter', altKey: true }).action,
    ).toBe('showBaselineHudBundle');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+Enter copy hud');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyHudBundle');
    expect(src).toContain('function copyDisneyExtremeBaselineHudBundle');
    expect(src).toContain("resolved.action === 'copyBaselineHudBundle'");
    expect(src).toContain('formatDisneyExtremeBaselineHudBundleLabel(');
  });
});
