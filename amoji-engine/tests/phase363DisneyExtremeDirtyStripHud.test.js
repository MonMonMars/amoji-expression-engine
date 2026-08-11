import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 363 Extreme dirty strip HUD', () => {
  it('wires live dirty strip synced from pin drift', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('dirty strip · live');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeDirty"');
    expect(src).toContain('function syncDisneyExtremeDirtyUi');
    expect(src).toContain('syncDisneyExtremeDirtyUi(');
    expect(src).toContain('formatDisneyExtremeBaselineDirtyStripLabel(');
    expect(src).toContain('is-dirty');
  });
});
