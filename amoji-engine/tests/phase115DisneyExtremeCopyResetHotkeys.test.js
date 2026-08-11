import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeHotkeyHelp,
} from '../engine/layers/emotionMorphs.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 115 Extreme C copy + R reset hotkeys', () => {
  it('resolves C/R actions and documents them in the help legend', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'c' })).toEqual({
      ok: true,
      action: 'copySummary',
    });
    expect(resolveDisneyExtremeHotkey({ key: 'R' }).action).toBe(
      'resetDefaults',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'c', target: { tagName: 'TEXTAREA' } })
        .ok,
    ).toBe(false);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('C copy');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('R reset');
    expect(formatDisneyExtremeHotkeyHelp()).toContain(
      'C copy · Shift+C copy diff · Alt+C share pin · ⇧Alt+C paste pin · R reset',
    );
  });

  it('Face Live shares reset/copy helpers with buttons and hotkeys', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('function resetDisneyExtremeUi()');
    expect(src).toContain('async function copyDisneyExtremeSummary()');
    expect(src).toContain("resolved.action === 'copySummary'");
    expect(src).toContain("resolved.action === 'resetDefaults'");
    expect(src).toContain('resetDisneyExtremeUi()');
    expect(src).toContain('copyDisneyExtremeSummary()');
    expect(src).toContain('<kbd>C</kbd>');
    expect(src).toContain('<kbd>R</kbd>');
  });
});
