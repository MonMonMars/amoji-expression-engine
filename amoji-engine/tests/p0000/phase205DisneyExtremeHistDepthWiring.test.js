import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 205 Extreme Face Live hist depth tooltip', () => {
  it('passes historyDepth into baseline summary title', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('historyDepth: extremeBaselineHistory.length');
    expect(src).toContain('formatDisneyExtremeBaselineSummary({');
  });
});
