import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 514 Extreme redo separator aria', () => {
  it('marks redo separator badge with separator role', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('redo separator badge · aria');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('applyDisneyExtremeCapacityBadgeAria(sep, { separator: true })');
    expect(src).toContain('extreme-redo-chip');
  });
});
