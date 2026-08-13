import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 149 Extreme Shift+F copy factor bars SVG', () => {
  it('resolves Shift+F to copyFactorBars', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'f' }).action).toBe(
      'showFactorBars',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'F', shiftKey: true }).action,
    ).toBe('copyFactorBars');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+F copy factors');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });

  it('Face Live wires copy factors button + hotkey + click', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="btnDisneyExtremeCopyFactors"');
    expect(src).toContain('async function copyDisneyExtremeFactorBarsSvg()');
    expect(src).toContain("resolved.action === 'copyFactorBars'");
    expect(src).toMatch(
      /copyDisneyExtremeFactorBarsSvg[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: 'factors SVG'/,
    );
    expect(src).toContain(
      'bindDisneyExtremeFlashCopySurface(disneyExtremeFactorBars',
    );
  });
});
