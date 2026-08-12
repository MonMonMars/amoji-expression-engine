import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 137 Extreme Shift+E copy ease SVG', () => {
  it('resolves Shift+E to copyEaseCurve', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'e' }).action).toBe(
      'showEaseCurve',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'E', shiftKey: true }).action,
    ).toBe('copyEaseCurve');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+E copy ease');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });

  it('Face Live wires copy ease button + hotkey', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="btnDisneyExtremeCopyEase"');
    expect(src).toContain('async function copyDisneyExtremeEaseSvg()');
    expect(src).toContain("resolved.action === 'copyEaseCurve'");
    expect(src).toMatch(
      /copyDisneyExtremeEaseSvg[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: 'ease SVG'/,
    );
  });
});
