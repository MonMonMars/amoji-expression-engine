import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 357 Extreme pin strip flash and clicks', () => {
  it('resolves Shift+Enter and wires pin strip click/dbl-click', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'Enter', shiftKey: true }).action,
    ).toBe('showBaselinePinStrip');
    expect(resolveDisneyExtremeHotkey({ key: 'Enter' }).action).toBe(
      'copyBaselineActive',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+Enter pin strip');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremePinStrip');
    expect(src).toContain('function flashDisneyExtremeBaselinePinStrip');
    expect(src).toContain("resolved.action === 'showBaselinePinStrip'");
    expect(src).toContain(
      "bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremePin')",
    );
    expect(src).toMatch(
      /disneyExtremePin[\s\S]*?flashDisneyExtremeBaselinePinStrip/,
    );
    expect(src).toMatch(
      /disneyExtremePin[\s\S]*?jumpDisneyExtremeBaselinePinSummary/,
    );
  });
});
