import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 117 Extreme H/? show help hotkey', () => {
  it('resolves H and ? as showHelp', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'h' })).toEqual({
      ok: true,
      action: 'showHelp',
    });
    expect(resolveDisneyExtremeHotkey({ key: '?' }).action).toBe('showHelp');
    expect(resolveDisneyExtremeHotkey({ key: 'H' }).action).toBe('showHelp');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('H help');
  });

  it('Face Live flashes formatDisneyExtremeHotkeyDigest on showHelp', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("resolved.action === 'showHelp'");
    expect(src).toContain('formatDisneyExtremeHotkeyDigest({');
    expect(src).toContain('<kbd>H</kbd>');
  });
});

