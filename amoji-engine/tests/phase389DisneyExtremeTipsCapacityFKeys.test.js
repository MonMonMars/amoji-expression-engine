import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 389 Extreme tips/capacity F6–F7', () => {
  it('resolves F6/F7 tips and capacity strip remaps and wires buttons', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'F6' }).action).toBe(
      'showBaselineTips',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'F6', shiftKey: true }).action,
    ).toBe('copyBaselineTips');
    expect(resolveDisneyExtremeHotkey({ key: 'F7' }).action).toBe(
      'showBaselineStacksCapacity',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'F7', shiftKey: true }).action,
    ).toBe('copyBaselineStacksCapacity');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('F6 tips strip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+F6 copy tips');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('F7 capacity strip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+F7 copy capacity');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeTipsFKey');
    expect(src).toContain('btnDisneyExtremeCopyTipsFKey');
    expect(src).toContain('btnDisneyExtremeCapacityFKey');
    expect(src).toContain('btnDisneyExtremeCopyCapacityFKey');
  });
});
