import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 314 Extreme ⇧Alt+T open More IO', () => {
  it('resolves ⇧Alt+T and wires Face Live force-open More IO', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 't',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('openMoreIo');
    expect(
      resolveDisneyExtremeHotkey({ key: 't', altKey: true }).action,
    ).toBe('toggleMoreIo');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+T open more IO');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeOpenMore');
    expect(src).toContain('function openDisneyExtremeMoreIo');
    expect(src).toContain("resolved.action === 'openMoreIo'");
    expect(src).toContain('toggleDisneyExtremeMoreIo({ open: true })');
  });
});
