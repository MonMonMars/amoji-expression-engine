import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  formatDisneyExtremeLiveHud,
  formatDisneyExtremeHotkeyHelp,
  easeEmotionIntensity,
  DISNEY_EXTREME_DEFAULTS,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 107 formatDisneyExtremeLiveHud + Face Live wiring', () => {
  it('formats off and on HUD copy', () => {
    expect(formatDisneyExtremeLiveHud({ enabled: false })).toEqual({
      pill: 'off',
      status: formatDisneyExtremeHotkeyHelp({ enabled: false }),
      ease: 0,
      recipe: 1,
    });
    const on = formatDisneyExtremeLiveHud({
      enabled: true,
      shapeInt: 1.12,
      bodyInt: 0.98,
      bodyOn: true,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(on.pill).toBe(`1.12 · e${easeEmotionIntensity(1.12).toFixed(2)}`);
    expect(on.ease).toBeCloseTo(easeEmotionIntensity(1.12));
    expect(on.recipe).toBeCloseTo(1 + 0.12 * 0.85);
    expect(on.status).toBe(
      `shape 1.12 · body 0.98 · ease ${easeEmotionIntensity(1.12).toFixed(2)} · recipe ×${(1 + 0.12 * 0.85).toFixed(2)} · eye×1.40 · mouth×1.50`,
    );
    const bodyOff = formatDisneyExtremeLiveHud({
      enabled: true,
      shapeInt: 1,
      bodyInt: 0.7,
      bodyOn: false,
      bodyMix: 0.7,
    });
    expect(bodyOff.pill).toBe(
      `1.00 · e${easeEmotionIntensity(1).toFixed(2)} · m0.70`,
    );
    expect(bodyOff.bodyMix).toBe(0.7);
    expect(bodyOff.status).toContain('body 0.70 (off)');
    expect(bodyOff.status).toContain('mix 0.70');
    expect(bodyOff.status).toContain(
      `eye×${DISNEY_EXTREME_DEFAULTS.eyeFactor.toFixed(2)}`,
    );
    expect(typeof engine.formatDisneyExtremeLiveHud).toBe('function');
  });

  it('Face Live shows Extreme pill + status from helper', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="hudExtreme"');
    expect(src).toContain('id="disneyExtremeStatus"');
    expect(src).toContain('formatDisneyExtremeLiveHud');
    expect(src).toContain('disneyExtremeStatus.textContent = extremeHud.status');
    expect(src).toContain('hudExtreme.textContent = extremeHud.pill');
  });
});
