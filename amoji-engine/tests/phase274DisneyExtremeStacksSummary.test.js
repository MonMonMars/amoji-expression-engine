import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineStacksSummaryLabel,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 274 Extreme Alt+L stacks summary', () => {
  it('formats stacks summary, resolves Alt+L, and wires Face Live', () => {
    expect(formatDisneyExtremeBaselineStacksSummaryLabel({})).toBe(
      'stacks · empty',
    );
    expect(
      formatDisneyExtremeBaselineStacksSummaryLabel({
        history: [{}, {}],
        redo: [{}],
        favorites: [{}, {}, {}],
      }),
    ).toBe('stacks · hist 2 · redo 1 · fav 3');
    expect(
      resolveDisneyExtremeHotkey({ key: 'l', altKey: true }).action,
    ).toBe('showBaselineStacks');
    expect(resolveDisneyExtremeHotkey({ key: 'l' }).action).toBe(
      'showBaselineHistory',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+L stacks');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeStacksList');
    expect(src).toContain('function flashDisneyExtremeBaselineStacksSummary');
    expect(src).toContain("resolved.action === 'showBaselineStacks'");
    expect(typeof engine.formatDisneyExtremeBaselineStacksSummaryLabel).toBe(
      'function',
    );
  });
});
