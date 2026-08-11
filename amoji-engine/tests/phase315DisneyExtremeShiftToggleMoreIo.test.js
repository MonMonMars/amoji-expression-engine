import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 315 Extreme Shift+T toggle More IO', () => {
  it('resolves Shift+T to toggleMoreIo alongside Alt+T', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 't', shiftKey: true }).action,
    ).toBe('toggleMoreIo');
    expect(
      resolveDisneyExtremeHotkey({ key: 't', altKey: true }).action,
    ).toBe('toggleMoreIo');
    expect(resolveDisneyExtremeHotkey({ key: 't' }).action).toBe(
      'copyBaselineFavoritesShareUrl',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+T more IO');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+T more IO');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('<kbd>⇧T</kbd>');
    expect(src).toContain("resolved.action === 'toggleMoreIo'");
  });
});
