import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const faceLivePath = fileURLToPath(new URL('../prototypes/face-live.html', import.meta.url));
describe('Phase 612 Extreme button aria audit', () => {
  it('wires toolbar button aria from title for all buttons', () => {
    const src = readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('wireDisneyExtremeToolbarButtonAria');
    expect((src.match(/aria-keyshortcuts=/g) || []).length).toBeGreaterThanOrEqual(150);
  });
});
