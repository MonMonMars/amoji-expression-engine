import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 385 Extreme Shift+F2 copy factors strip', () => {
  it('resolves Shift+F2 and wires factors strip copy + dbl-click', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'F2', shiftKey: true }).action,
    ).toBe('copyBaselineFactorsStrip');
    expect(resolveDisneyExtremeHotkey({ key: 'F2' }).action).toBe(
      'showBaselineFactorsStrip',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+F2 copy factors');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyFactorsStrip');
    expect(src).toContain('function copyDisneyExtremeBaselineFactorsStrip');
    expect(src).toContain("resolved.action === 'copyBaselineFactorsStrip'");
    expect(src).toContain(
      "bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeFactorsStrip')",
    );
  });
});
