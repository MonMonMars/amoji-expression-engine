import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  formatDisneyExtremeHotkeyHelp,
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeLiveHud,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 114 Extreme hotkey help + Copy summary', () => {
  it('shares one hotkey legend across help + HUD off status', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('[ ] shape');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('- = body');
    expect(formatDisneyExtremeHotkeyHelp()).toBe(
      `extreme off · ${DISNEY_EXTREME_HOTKEY_HELP}`,
    );
    expect(formatDisneyExtremeHotkeyHelp({ enabled: true })).toBe(
      `extreme on · ${DISNEY_EXTREME_HOTKEY_HELP}`,
    );
    expect(formatDisneyExtremeLiveHud({ enabled: false }).status).toBe(
      formatDisneyExtremeHotkeyHelp({ enabled: false }),
    );
    expect(typeof engine.formatDisneyExtremeHotkeyHelp).toBe('function');
    expect(engine.DISNEY_EXTREME_HOTKEY_HELP).toBe(DISNEY_EXTREME_HOTKEY_HELP);
  });

  it('Face Live Copy summary button wires clipboard + status flash', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="btnDisneyExtremeCopy"');
    expect(src).toContain('formatDisneyExtremeHotkeyHelp');
    expect(src).toContain("getElementById('btnDisneyExtremeCopy')");
    expect(src).toContain('navigator.clipboard');
    expect(src).toContain('copied · ${text}');
  });
});
