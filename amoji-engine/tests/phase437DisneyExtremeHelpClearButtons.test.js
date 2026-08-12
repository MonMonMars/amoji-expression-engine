import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 437 Extreme help/clear hotkey buttons', () => {
  it('adds H/Delete/⇧Alt+Delete buttons and keeps hotkey resolution', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'h' }).action).toBe('showHelp');
    expect(resolveDisneyExtremeHotkey({ key: '?' }).action).toBe('showHelp');
    expect(resolveDisneyExtremeHotkey({ key: 'Delete' }).action).toBe(
      'clearStatusHold',
    );
    expect(
      resolveDisneyExtremeHotkey({
        key: 'Delete',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('clearTransient');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('H digest · button');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+Delete · button');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="btnDisneyExtremeShowHelp"');
    expect(src).toContain('id="btnDisneyExtremeClearTransient"');
    expect(src).toContain('id="btnDisneyExtremeClearActive"');
    expect(src).toContain('Help digest <kbd>H</kbd>');
    expect(src).toContain('Clear transient <kbd>⇧Alt+Delete</kbd>');
    expect(src).toContain(
      "getElementById('btnDisneyExtremeShowHelp')?.addEventListener('click'",
    );
    expect(src).toContain(
      "getElementById('btnDisneyExtremeClearTransient')?.addEventListener('click'",
    );
  });
});
