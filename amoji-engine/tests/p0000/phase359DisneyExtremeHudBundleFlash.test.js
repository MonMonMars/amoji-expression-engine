import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 359 Extreme Alt+Enter hud bundle', () => {
  it('resolves Alt+Enter and wires Face Live HUD bundle flash', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'Enter', altKey: true }).action,
    ).toBe('showBaselineHudBundle');
    expect(resolveDisneyExtremeHotkey({ key: 'Enter' }).action).toBe(
      'copyBaselineActive',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+Enter hud bundle');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeHudBundle');
    expect(src).toContain('function flashDisneyExtremeBaselineHudBundle');
    expect(src).toContain("resolved.action === 'showBaselineHudBundle'");
    expect(src).toContain('formatDisneyExtremeBaselineHudBundleSummary(');
  });
});
