import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  DISNEY_EXTREME_BASELINE_HISTORY_LIMIT,
  DISNEY_EXTREME_BASELINE_FAVORITES_LIMIT,
  formatDisneyExtremeBaselineStacksCapacityLabel,
  buildDisneyExtremeLiveSnapshot,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 338 Extreme ` stacks capacity', () => {
  it('formats capacity label, resolves `, and wires Face Live flash', () => {
    expect(DISNEY_EXTREME_BASELINE_HISTORY_LIMIT).toBe(8);
    expect(DISNEY_EXTREME_BASELINE_FAVORITES_LIMIT).toBe(8);
    expect(formatDisneyExtremeBaselineStacksCapacityLabel({})).toBe(
      'stacks · hist 0/8 · redo 0/8 · fav 0/8',
    );
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.4,
      shapeFactor: 1.1,
    });
    expect(
      formatDisneyExtremeBaselineStacksCapacityLabel({
        history: [snap, snap],
        redo: [snap],
        favorites: [snap, snap, snap],
      }),
    ).toBe('stacks · hist 2/8 · redo 1/8 · fav 3/8');
    expect(resolveDisneyExtremeHotkey({ key: '`' }).action).toBe(
      'showBaselineStacksCapacity',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: '~', shiftKey: true }).action,
    ).toBe('copyBaselineStacksCapacity');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('` stacks capacity');
    expect(typeof engine.formatDisneyExtremeBaselineStacksCapacityLabel).toBe(
      'function',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeStacksCapacity');
    expect(src).toContain('function flashDisneyExtremeBaselineStacksCapacity');
    expect(src).toContain("resolved.action === 'showBaselineStacksCapacity'");
    expect(src).toContain('formatDisneyExtremeBaselineStacksCapacityLabel(');
  });
});
