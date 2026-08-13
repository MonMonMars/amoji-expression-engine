import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 299 Extreme Alt+E copy ease label', () => {
  it('resolves Alt+E and wires Face Live ease label copy', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'e', altKey: true }).action,
    ).toBe('copyEaseCurveLabel');
    expect(resolveDisneyExtremeHotkey({ key: 'e' }).action).toBe(
      'showEaseCurve',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'e', shiftKey: true }).action,
    ).toBe('copyEaseCurve');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+E copy ease label');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyEaseLabel');
    expect(src).toContain('function copyDisneyExtremeEaseCurveLabel');
    expect(src).toContain("resolved.action === 'copyEaseCurveLabel'");
    expect(src).toContain('formatDisneyExtremeEaseCurveLabel({');
  });
});
