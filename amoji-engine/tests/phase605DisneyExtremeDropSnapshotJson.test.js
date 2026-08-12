import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 605 Extreme dropSnapshotJson', () => {
  it('covers dropSnapshotJson metadata', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('drop JSON · hist/redo/fav/stacks/snap · Meta preview · Shift merge · dbl-click paste');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('handleDisneyExtremeSnapshotDrop');
  });
});
