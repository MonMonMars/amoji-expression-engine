import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 2851545 Extreme ariaCurrentUnderlineOffsetDoc66', () => {
  it('covers ariaCurrentUnderlineOffsetDoc66 metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('docs · aria-current underline-offset policy keep66');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('text-underline-offset: 4px');
  });
});
