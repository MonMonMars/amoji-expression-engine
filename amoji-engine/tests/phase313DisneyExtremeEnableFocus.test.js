import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 313 Extreme ⇧Alt+X enable + focus', () => {
  it('resolves ⇧Alt+X and wires Face Live enable+focus', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'x',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('enableFocusExtremePanel');
    expect(
      resolveDisneyExtremeHotkey({ key: 'x', altKey: true }).action,
    ).toBe('focusExtremePanel');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+X enable+focus');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeEnableFocus');
    expect(src).toContain('function enableFocusDisneyExtremePanel');
    expect(src).toContain("resolved.action === 'enableFocusExtremePanel'");
    expect(src).toContain('enableDisneyExtreme()');
    expect(src).toContain('focusDisneyExtremePanel()');
  });
});
