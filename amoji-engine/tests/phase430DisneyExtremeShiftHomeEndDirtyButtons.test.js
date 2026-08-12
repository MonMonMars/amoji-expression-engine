import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 430 Extreme Shift+Home/End dirty strip buttons', () => {
  it('adds open/copy-open buttons and polishes dirty strip titles', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+Home open dirty');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+End copy dirty open');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="btnDisneyExtremeOpenDirtyStrip"');
    expect(src).toContain('id="btnDisneyExtremeCopyDirtyStripOpen"');
    expect(src).toContain('Open dirty <kbd>⇧Home</kbd>');
    expect(src).toContain('Copy dirty open <kbd>⇧End</kbd>');
    expect(src).toContain('⇧Home open · ⇧End copy open');
    expect(src).toContain(
      "getElementById('btnDisneyExtremeOpenDirtyStrip')?.addEventListener('click'",
    );
    expect(src).toContain(
      "getElementById('btnDisneyExtremeCopyDirtyStripOpen')?.addEventListener('click'",
    );
  });
});
