import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 426 Extreme Shift+Home/End dirty strip open', () => {
  it('resolves Shift+Home/End and wires open+flash/copy', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'Home', shiftKey: true }).action,
    ).toBe('openBaselineDirtyStrip');
    expect(
      resolveDisneyExtremeHotkey({ key: 'End', shiftKey: true }).action,
    ).toBe('copyBaselineDirtyStripOpen');
    expect(resolveDisneyExtremeHotkey({ key: 'Home' }).action).toBe(
      'showBaselineDirtyStrip',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'End' }).action).toBe(
      'copyBaselineDirtyStrip',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+Home open dirty');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+End copy dirty open');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function openDisneyExtremeDirtyStrip');
    expect(src).toContain('function copyDisneyExtremeBaselineDirtyStripOpen');
    expect(src).toContain("resolved.action === 'openBaselineDirtyStrip'");
    expect(src).toContain("resolved.action === 'copyBaselineDirtyStripOpen'");
  });
});
