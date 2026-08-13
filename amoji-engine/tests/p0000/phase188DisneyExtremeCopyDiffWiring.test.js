import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 188 Extreme Face Live copy diff wiring', () => {
  it('wires Copy diff button and Shift+C action', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="btnDisneyExtremeCopyDiff"');
    expect(src).toContain('async function copyDisneyExtremeSnapshotDiff()');
    expect(src).toContain("resolved.action === 'copySnapshotDiff'");
    expect(src).toContain('formatDisneyExtremeSnapshotDiffCopyText');
    expect(src).toContain('<kbd>⇧C</kbd>');
  });
});
