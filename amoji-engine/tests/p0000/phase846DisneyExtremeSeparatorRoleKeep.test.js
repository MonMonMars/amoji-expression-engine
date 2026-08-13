import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 846 Extreme separatorRoleKeep', () => {
  it('covers separatorRoleKeep metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('redo separator · role=separator');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('opts.separator ? \'separator\'');
  });
});
