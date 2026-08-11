import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineActiveLabel,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 353 Extreme active chips strip', () => {
  it('formats active label, resolves ⇧Alt+Space, and wires active strip', () => {
    expect(formatDisneyExtremeBaselineActiveLabel({})).toBe(
      'active · hist · — · redo · — · fav · —',
    );
    expect(
      formatDisneyExtremeBaselineActiveLabel({
        historyIndex: 2,
        redoIndex: null,
        favoriteIndex: 0,
      }),
    ).toBe('active · hist · #3 · redo · — · fav · #1');
    expect(
      formatDisneyExtremeBaselineActiveLabel({ historyIndex: 0 }),
    ).toBe('active · hist · #1 · redo · — · fav · —');
    expect(
      resolveDisneyExtremeHotkey({
        key: ' ',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('showBaselineActive');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+Space active chips');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('active strip · live');
    expect(typeof engine.formatDisneyExtremeBaselineActiveLabel).toBe(
      'function',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeActive"');
    expect(src).toContain('btnDisneyExtremeActive');
    expect(src).toContain('function syncDisneyExtremeActiveUi');
    expect(src).toContain('function flashDisneyExtremeBaselineActive');
    expect(src).toContain("resolved.action === 'showBaselineActive'");
    expect(src).toContain('formatDisneyExtremeBaselineActiveLabel(');
  });
});
