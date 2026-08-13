import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 344 Extreme capacity strip HUD', () => {
  it('wires live capacity strip synced from hist/redo/fav stacks', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('capacity strip · live');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeCapacity"');
    expect(src).toContain('function syncDisneyExtremeCapacityUi');
    expect(src).toContain('syncDisneyExtremeCapacityUi()');
    expect(src).toContain('formatDisneyExtremeBaselineStacksCapacityLabel({');
    expect(src).toContain("getElementById('disneyExtremeCapacity')");
  });
});
