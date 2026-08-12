import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 507 Extreme chip aria metadata', () => {
  it('adds aria-label and aria-keyshortcuts on baseline chips', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('hist/fav/redo chips · aria metadata');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("btn.setAttribute('aria-label', btn.title || btn.textContent || '')");
    expect(src).toContain("btn.setAttribute('aria-keyshortcuts', 'Enter Shift+Enter')");
  });
});
