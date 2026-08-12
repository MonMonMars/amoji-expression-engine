import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 345 Extreme capacity strip click actions', () => {
  it('wires capacity strip click flash and dbl-click copy', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeCapacity"');
    expect(src).toMatch(
      /disneyExtremeCapacity[\s\S]*?flashDisneyExtremeBaselineStacksCapacity/,
    );
    expect(src).toMatch(
      /disneyExtremeCapacity[\s\S]*?copyDisneyExtremeBaselineStacksCapacity/,
    );
    expect(src).toContain(
      "bindDisneyExtremeFlashCopySurface(document.getElementById('disneyExtremeCapacity')",
    );
  });
});
