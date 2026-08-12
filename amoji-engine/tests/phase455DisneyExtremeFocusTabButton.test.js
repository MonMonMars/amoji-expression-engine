import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 455 Extreme Tab focus panel button', () => {
  it('adds Tab mirror focus button and keeps hotkey mapping', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'Tab' }).action).toBe('focusExtremePanel');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Tab focus panel · button');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="btnDisneyExtremeFocusPanelTab"');
    expect(src).toContain('Focus panel <kbd>Tab</kbd>');
    expect(src).toContain("getElementById('btnDisneyExtremeFocusPanelTab')?.addEventListener('click'");
    expect(src).toContain('focusDisneyExtremePanel();');
  });
});
