import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 278 Extreme Alt+T toggle More IO', () => {
  it('resolves Alt+T and wires Face Live More IO toggle', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 't', altKey: true }).action,
    ).toBe('toggleMoreIo');
    expect(resolveDisneyExtremeHotkey({ key: 't' }).action).toBe(
      'copyBaselineFavoritesShareUrl',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+T more IO');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeToggleMore');
    expect(src).toContain('function toggleDisneyExtremeMoreIo');
    expect(src).toContain("resolved.action === 'toggleMoreIo'");
    expect(src).toContain('more IO · open');
    expect(src).toContain('more IO · closed');
  });
});
