import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 474 Extreme interactive focus-visible polish', () => {
  it('adds focus-visible outlines for role=button interactive Extreme elements', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('interactive focus-visible polish');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('.status[role="button"]:focus-visible');
    expect(src).toContain('.pill[role="button"]:focus-visible');
    expect(src).toContain('.extreme-ease-spark[role="button"]:focus-visible');
    expect(src).toContain('outline: 2px solid #8ac6ff;');
  });
});
