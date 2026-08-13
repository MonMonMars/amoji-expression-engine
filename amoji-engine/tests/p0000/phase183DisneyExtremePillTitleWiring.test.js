import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 183 Extreme baseline pill title wiring', () => {
  it('sets pillExtreme title from baseline summary', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('formatDisneyExtremeBaselineSummary');
    expect(src).toContain("pillExtreme?.setAttribute(");
    expect(src).toContain("'title'");
    expect(src).toContain('dirtyHud.hasBaseline');
    expect(src).toContain('dirtyHud.fp');
  });
});
