import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 308 Extreme Shift+N copy factors label', () => {
  it('resolves Shift+N and wires Face Live factors label copy', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'n', shiftKey: true }).action,
    ).toBe('copyFactorBarsLabel');
    expect(resolveDisneyExtremeHotkey({ key: 'n' }).action).toBe(
      'showNeckBlend',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'n', altKey: true }).action,
    ).toBe('copyNeckLabel');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+N copy factors label');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyFactorsLabel');
    expect(src).toContain('function copyDisneyExtremeFactorBarsLabel');
    expect(src).toContain("resolved.action === 'copyFactorBarsLabel'");
    expect(src).toContain('formatDisneyExtremeFactorBarsLabel(disneyExtremeFactorOpts())');
  });
});
