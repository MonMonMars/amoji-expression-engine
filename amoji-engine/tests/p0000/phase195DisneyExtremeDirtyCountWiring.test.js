import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 195 Extreme Face Live dirty×N pill wiring', () => {
  it('passes changeCount from snapshot diff into dirty HUD bit', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('diffDisneyExtremeSnapshots(extremeSnap, lastExtremeBaselineSnap)');
    expect(src).toContain('changeCount: extremeDiff.changes.length');
    expect(src).toContain('dirty×${dirtyHud.changeCount}');
  });
});
