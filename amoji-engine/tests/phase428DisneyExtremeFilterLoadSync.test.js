import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 428 Extreme filter load sync', () => {
  it('bootstraps filter before first prefs summary sync', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    const bootIdx = src.indexOf('bootstrapDisneyExtremeStripsFilter();');
    const syncIdx = src.indexOf('syncDisneyExtremePrefsSummary(savedPrefs);');
    expect(bootIdx).toBeGreaterThan(-1);
    expect(syncIdx).toBeGreaterThan(bootIdx);
    expect(src).toContain('function bootstrapDisneyExtremeStripsFilter');
    expect(src).toContain('loadDisneyExtremeStripsFilter');
  });
});
