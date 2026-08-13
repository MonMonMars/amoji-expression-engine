import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 142 Extreme Shift+M copy body mix SVG', () => {
  it('resolves Shift+M to copyBodyMixCurve', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'm' }).action).toBe(
      'showBodyMix',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'M', shiftKey: true }).action,
    ).toBe('copyBodyMixCurve');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+M copy mix');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });

  it('Face Live wires copy mix button + hotkey', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="btnDisneyExtremeCopyMix"');
    expect(src).toContain('async function copyDisneyExtremeBodyMixSvg()');
    expect(src).toContain("resolved.action === 'copyBodyMixCurve'");
    expect(src).toMatch(
      /copyDisneyExtremeBodyMixSvg[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: 'mix SVG'/,
    );
  });
});
