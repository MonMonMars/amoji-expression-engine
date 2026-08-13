import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 365 Extreme End copy dirty strip', () => {
  it('resolves End and wires dirty strip copy + click actions', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'End' }).action).toBe(
      'copyBaselineDirtyStrip',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'Home' }).action).toBe(
      'showBaselineDirtyStrip',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('End copy dirty');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyDirtyStrip');
    expect(src).toContain('function copyDisneyExtremeBaselineDirtyStrip');
    expect(src).toContain("resolved.action === 'copyBaselineDirtyStrip'");
    expect(src).toContain(
      "bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeDirty')",
    );
  });
});
