import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 396 Extreme Alt+PageDown curve strips flash', () => {
  it('resolves Alt+PageDown and wires curve strip flash', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'PageDown', altKey: true }).action,
    ).toBe('showBaselineCurveStrip');
    expect(resolveDisneyExtremeHotkey({ key: 'PageDown' }).action).toBe(
      'showBaselineStripsSummary',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+PageDown curve strips');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCurveStrip');
    expect(src).toContain('function flashDisneyExtremeBaselineCurveStrip');
    expect(src).toContain("resolved.action === 'showBaselineCurveStrip'");
    expect(src).toContain(
      "bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeCurveStrip')",
    );
  });
});
