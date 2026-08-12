import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 196 Extreme dbl-click drop hint paste', () => {
  it('wires dblclick paste and documents it in help', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremeDropHint"');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(document.getElementById(\'disneyExtremeDropHint\')');
    expect(src).toContain('pasteOnDblClick: true');
    expect(src).toContain('pasteDisneyExtremeSnapshotJson()');
    expect(src).toContain('dbl-click paste');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('dbl-click paste');
  });
});
