import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 384 Extreme F2 factors strip flash', () => {
  it('resolves F2 and wires Face Live factors strip flash', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'F2' }).action).toBe(
      'showBaselineFactorsStrip',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'F2', shiftKey: true }).action,
    ).toBe('copyBaselineFactorsStrip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('F2 factors strip');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeFactorsStrip');
    expect(src).toContain('function flashDisneyExtremeBaselineFactorsStrip');
    expect(src).toContain("resolved.action === 'showBaselineFactorsStrip'");
    expect(src).toContain(
      "bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeFactorsStrip')",
    );
  });
});
