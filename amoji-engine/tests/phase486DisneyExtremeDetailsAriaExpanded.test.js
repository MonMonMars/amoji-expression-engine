import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 486 Extreme details aria-expanded sync', () => {
  it('syncs aria-expanded on strips and more summaries', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('details summaries · aria-expanded');
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('function syncDisneyExtremeDetailsAriaExpanded');
    expect(src).toContain('syncDisneyExtremeDetailsAriaExpanded(strips, stripsSummary)');
    expect(src).toContain('syncDisneyExtremeDetailsAriaExpanded(moreIo, moreSummary)');
    expect(src).toContain("setAttribute('aria-expanded'");
  });
});
