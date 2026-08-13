import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineCurveStripsBundle,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 397 Extreme ⇧Alt+PageDown copy curve strips', () => {
  it('resolves Shift+Alt+PageDown and wires curve strip copy', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'PageDown',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyBaselineCurveStrip');
    expect(
      resolveDisneyExtremeHotkey({ key: 'PageDown', altKey: true }).action,
    ).toBe('showBaselineCurveStrip');
    const bundle = formatDisneyExtremeBaselineCurveStripsBundle({});
    expect(bundle).toContain('ease ·');
    expect(bundle).toContain('mix ·');
    expect(bundle).toContain('neck ·');
    expect(bundle.split('\n')).toHaveLength(3);
    expect(typeof engine.formatDisneyExtremeBaselineCurveStripsBundle).toBe(
      'function',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      '⇧Alt+PageDown copy curves',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyCurveStrip');
    expect(src).toContain('function copyDisneyExtremeBaselineCurveStrip');
    expect(src).toContain("resolved.action === 'copyBaselineCurveStrip'");
    expect(src).toContain(
      "bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeCurveStrip')",
    );
  });
});
