import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeNeckFactorsBundle,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 322 Extreme ⇧Alt+N copy neck+factors', () => {
  it('resolves ⇧Alt+N and wires Face Live neck+factors bundle copy', () => {
    const text = formatDisneyExtremeNeckFactorsBundle({
      enabled: true,
      bodyOn: true,
      shapeFactor: 1.4,
      bodyFactor: 1.2,
      eyeFactor: 1.5,
      mouthFactor: 1.3,
      neckBlend: 0.5,
      bodyMix: 1.1,
      bodyInt: 1.1,
    });
    expect(text).toContain('\n');
    expect(text.split('\n').length).toBeGreaterThanOrEqual(2);
    expect(
      resolveDisneyExtremeHotkey({
        key: 'n',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyNeckFactorsBundle');
    expect(
      resolveDisneyExtremeHotkey({ key: 'n', altKey: true }).action,
    ).toBe('copyNeckLabel');
    expect(
      resolveDisneyExtremeHotkey({ key: 'n', shiftKey: true }).action,
    ).toBe('copyFactorBarsLabel');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+N copy neck+factors');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyNeckFactors');
    expect(src).toContain('function copyDisneyExtremeNeckFactorsBundle');
    expect(src).toContain("resolved.action === 'copyNeckFactorsBundle'");
    expect(src).toContain('formatDisneyExtremeNeckFactorsBundle(');
  });
});
