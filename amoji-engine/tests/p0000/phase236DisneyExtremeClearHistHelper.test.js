import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 236 Extreme Face Live clear hist helper', () => {
  it('defines clear hist-only path that keeps baseline', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function clearDisneyExtremeBaselineHistoryOnly');
    expect(src).toContain('hasDisneyExtremeBaselineHistory');
    expect(src).toContain('cleared · hist');
    expect(src).toContain('clear hist · empty');
    expect(src).not.toContain(
      'function clearDisneyExtremeBaselineHistoryOnly() {\n        if (!lastExtremeBaselineSnap)',
    );
  });
});
