import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 1573320 Extreme prefersReducedTransparency14', () => {
  it('covers prefersReducedTransparency14 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('transparency · prefers-reduced-transparency keep4');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('prefers-reduced-transparency');
  });
});
