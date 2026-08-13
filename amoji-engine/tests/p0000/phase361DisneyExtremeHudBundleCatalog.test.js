import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 361 Extreme HUD bundle catalog note', () => {
  it('documents hud bundle in catalog and Face Live history title', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'hud bundle · tips/roots/cap/active/pin/dirty/factors/curves',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('Alt+Enter hud');
    expect(src).toContain('⇧Alt+Enter copy hud');
    expect(src).toContain('btnDisneyExtremeHudBundle');
    expect(src).toContain('btnDisneyExtremeCopyHudBundle');
  });
});
