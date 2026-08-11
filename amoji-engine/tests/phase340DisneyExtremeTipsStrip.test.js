import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 340 Extreme tips strip HUD', () => {
  it('wires live tips strip synced from hist/redo/fav stacks', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('tips strip · live');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeTips"');
    expect(src).toContain('function syncDisneyExtremeTipsUi');
    expect(src).toContain('syncDisneyExtremeTipsUi()');
    expect(src).toContain('formatDisneyExtremeBaselineTipsLabel({');
    expect(src).toContain("getElementById('disneyExtremeTips')");
    expect(src).toMatch(/disneyExtremeTips[\s\S]*?flashDisneyExtremeBaselineTips/);
    expect(src).toMatch(/disneyExtremeTips[\s\S]*?copyDisneyExtremeBaselineTips/);
  });
});
