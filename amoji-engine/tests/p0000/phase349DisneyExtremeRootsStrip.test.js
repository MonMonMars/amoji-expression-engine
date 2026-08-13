import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 349 Extreme roots strip HUD', () => {
  it('wires live roots strip with click flash and dbl-click copy', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('roots strip · live');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeRoots"');
    expect(src).toContain('function syncDisneyExtremeRootsUi');
    expect(src).toContain('syncDisneyExtremeRootsUi()');
    expect(src).toContain('formatDisneyExtremeBaselineRootsLabel({');
    expect(src).toContain("getElementById('disneyExtremeRoots')");
    expect(src).toMatch(
      /disneyExtremeRoots[\s\S]*?flashDisneyExtremeBaselineRoots/,
    );
    expect(src).toMatch(
      /disneyExtremeRoots[\s\S]*?copyDisneyExtremeBaselineRoots/,
    );
  });
});
