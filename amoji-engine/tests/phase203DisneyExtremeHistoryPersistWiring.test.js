import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 203 Extreme Face Live history persist wiring', () => {
  it('loads, saves, and clears baseline history storage', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('loadDisneyExtremeBaselineHistory()');
    expect(src).toContain('function persistDisneyExtremeBaselineHistory()');
    expect(src).toContain('saveDisneyExtremeBaselineHistory(extremeBaselineHistory)');
    expect(src).toContain('clearDisneyExtremeBaselineHistoryStorage()');
    expect(src).toContain('persistDisneyExtremeBaselineHistory()');
  });
});
