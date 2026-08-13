import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 163 Extreme spark rebuild fingerprint gate', () => {
  it('skips SVG rebuilds when snapshot fingerprint is unchanged', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('let lastExtremeSparkFp = \'\'');
    expect(src).toContain('disneyExtremeSnapshotFingerprint(extremeSnap)');
    expect(src).toContain('if (extremeFp !== lastExtremeSparkFp)');
    expect(src).toContain('lastExtremeSparkFp = extremeFp');
  });
});
