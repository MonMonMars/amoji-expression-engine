import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../../prototypes/face-live.html', import.meta.url));
describe('Phase 494 Extreme bind helper paste', () => {
  it('extends bind helper with onPaste and pasteOnDblClick', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('bind helper paste');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('const onPaste = typeof opts.onPaste === \'function\'');
    expect(src).toContain('pasteOnDblClick');
    expect(src).toContain('onPaste()');
  });
});
