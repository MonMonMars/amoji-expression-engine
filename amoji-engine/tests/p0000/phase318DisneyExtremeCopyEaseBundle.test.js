import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeEaseCurveBundle,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 318 Extreme ⇧Alt+E copy ease+svg', () => {
  it('resolves ⇧Alt+E and wires Face Live ease label+SVG bundle copy', () => {
    const text = formatDisneyExtremeEaseCurveBundle({
      enabled: true,
      markerT: 1.25,
    });
    expect(text).toContain('ease ');
    expect(text).toContain('<svg');
    expect(
      resolveDisneyExtremeHotkey({
        key: 'e',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyEaseCurveBundle');
    expect(
      resolveDisneyExtremeHotkey({ key: 'e', altKey: true }).action,
    ).toBe('copyEaseCurveLabel');
    expect(
      resolveDisneyExtremeHotkey({ key: 'e', shiftKey: true }).action,
    ).toBe('copyEaseCurve');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+E copy ease+svg');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyEaseBundle');
    expect(src).toContain('function copyDisneyExtremeEaseCurveBundle');
    expect(src).toContain("resolved.action === 'copyEaseCurveBundle'");
    expect(src).toContain('formatDisneyExtremeEaseCurveBundle(');
  });
});
