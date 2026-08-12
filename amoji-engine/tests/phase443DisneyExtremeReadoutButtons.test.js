import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 443 Extreme E/M/F/N readout buttons', () => {
  it('wires ease/mix/factors/neck flash readout buttons', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'e' }).action).toBe('showEaseCurve');
    expect(resolveDisneyExtremeHotkey({ key: 'm' }).action).toBe('showBodyMix');
    expect(resolveDisneyExtremeHotkey({ key: 'f' }).action).toBe('showFactorBars');
    expect(resolveDisneyExtremeHotkey({ key: 'n' }).action).toBe('showNeckBlend');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('E ease · button');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('N neck · button');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="btnDisneyExtremeEaseReadout"');
    expect(src).toContain('id="btnDisneyExtremeMixReadout"');
    expect(src).toContain('id="btnDisneyExtremeFactorsReadout"');
    expect(src).toContain('id="btnDisneyExtremeNeckReadout"');
    expect(src).toContain(
      "getElementById('btnDisneyExtremeEaseReadout')?.addEventListener('click'",
    );
    expect(src).toContain('flashDisneyExtremeEaseCurve();');
    expect(src).toContain('flashDisneyExtremeBodyMix();');
    expect(src).toContain('flashDisneyExtremeFactorBars();');
    expect(src).toContain('flashDisneyExtremeNeck();');
  });
});
