import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineStacksCapacityLabel,
} from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 339 Extreme Shift+` copy stacks capacity', () => {
  it('resolves Shift+` / ~ and wires Face Live capacity clipboard copy', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: '`', shiftKey: true }).action,
    ).toBe('copyBaselineStacksCapacity');
    expect(resolveDisneyExtremeHotkey({ key: '~' }).action).toBe(
      'copyBaselineStacksCapacity',
    );
    expect(resolveDisneyExtremeHotkey({ key: '`' }).action).toBe(
      'showBaselineStacksCapacity',
    );
    expect(formatDisneyExtremeBaselineStacksCapacityLabel({})).toContain(
      '0/8',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+` copy capacity');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyStacksCapacity');
    expect(src).toContain('function copyDisneyExtremeBaselineStacksCapacity');
    expect(src).toContain("resolved.action === 'copyBaselineStacksCapacity'");
  });
});
