import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 489 Extreme status Shift+Enter copy', () => {
  it('copies summary on status Shift+Enter', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('status row · ⇧Enter copy summary');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremeStatus');
    expect(src).toContain('copyDisneyExtremeSummary()');
    expect(src).toContain('id="disneyExtremeStatus"');
    expect(src).toContain('aria-keyshortcuts="Enter Space Shift+Enter"');
  });
});
