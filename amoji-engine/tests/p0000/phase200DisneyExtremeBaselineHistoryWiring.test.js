import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 200 Extreme Face Live baseline history push', () => {
  it('pushes prior baseline via setDisneyExtremeBaseline helper', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('let extremeBaselineHistory = loadDisneyExtremeBaselineHistory()');
    expect(src).toContain('function setDisneyExtremeBaseline(snap)');
    expect(src).toContain('pushDisneyExtremeBaselineHistory');
    expect(src).toContain('persistDisneyExtremeBaselineHistory()');
    expect(src).toContain('setDisneyExtremeBaseline(snap)');
    expect(src).toContain('setDisneyExtremeBaseline(parsed.snap)');
  });
});
