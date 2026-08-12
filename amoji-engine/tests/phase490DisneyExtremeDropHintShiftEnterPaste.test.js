import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 490 Extreme drop hint Shift+Enter paste', () => {
  it('pastes snapshot JSON on drop hint Shift+Enter', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('drop hint · ⇧Enter paste');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeDropHint')");
    expect(src).toContain('onPaste: () => pasteDisneyExtremeSnapshotJson()');
    expect(src).toContain('pasteDisneyExtremeSnapshotJson()');
  });
});
