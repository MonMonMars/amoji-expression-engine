import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 159 Extreme Face Live snapshot wiring', () => {
  it('animate loop and flashes use disneyExtremeSnapshot', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('function disneyExtremeSnapshot(');
    expect(src).toContain('buildDisneyExtremeLiveSnapshot({');
    expect(src).toContain(
      'const extremeSnap = disneyExtremeSnapshot(displayInt)',
    );
    expect(src).toContain(
      'formatDisneyExtremeLiveHudFromSnapshot(extremeSnap)',
    );
    expect(src).toContain(
      'formatDisneyExtremeBundleLabel(disneyExtremeSnapshot())',
    );
    expect(src).toContain('shapeFactor: extremeSnap.shapeFactor');
  });
});
