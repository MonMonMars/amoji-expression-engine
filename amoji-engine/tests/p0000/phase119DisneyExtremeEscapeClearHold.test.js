import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 119 Escape clears Extreme status hold', () => {
  it('claims Escape only while a status hold is active', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'Escape' })).toEqual({
      ok: false,
      reason: 'no_hold',
    });
    expect(
      resolveDisneyExtremeHotkey(
        { key: 'Escape' },
        { holdingStatus: true },
      ),
    ).toEqual({ ok: true, action: 'clearStatusHold' });
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Esc clear');
  });

  it('Face Live clears hold deadline on Escape', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('holdingStatus: shouldHoldDisneyExtremeStatus');
    expect(src).toContain("resolved.action === 'clearStatusHold'");
    expect(src).toContain('disneyExtremeStatusHoldUntil = 0');
    expect(src).toContain('<kbd>Esc</kbd>');
  });
});
