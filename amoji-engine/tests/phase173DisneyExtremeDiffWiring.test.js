import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 173 Extreme Face Live diff baseline wiring', () => {
  it('tracks clipboard baseline and wires D / Diff button', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('let lastExtremeBaselineSnap = null');
    expect(src).toContain('id="btnDisneyExtremeDiff"');
    expect(src).toContain('function flashDisneyExtremeSnapshotDiff()');
    expect(src).toContain("resolved.action === 'showSnapshotDiff'");
    expect(src).toContain('lastExtremeBaselineSnap = snap');
    expect(src).toContain('lastExtremeBaselineSnap = parsed.snap');
    expect(src).toContain('diff · no baseline');
    expect(src).toContain('formatDisneyExtremeSnapshotDiffLabel');
    expect(src).toContain('<kbd>D</kbd>');
  });
});
