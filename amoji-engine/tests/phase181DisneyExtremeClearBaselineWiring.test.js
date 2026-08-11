import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 181 Extreme Face Live clear baseline + fp pill', () => {
  it('wires capture, clear button, K action, and fp on dirty bit', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('saveDisneyExtremeBaseline');
    expect(src).toContain('id="btnDisneyExtremeClearBase"');
    expect(src).toContain('function clearDisneyExtremeBaseline()');
    expect(src).toContain("resolved.action === 'clearBaseline'");
    expect(src).toContain('cleared · baseline');
    expect(src).toContain('clearDisneyExtremeBaselineStorage()');
    expect(src).toContain('disneyExtremeSnapshotFingerprintShort(lastExtremeBaselineSnap)');
    expect(src).toContain('<kbd>K</kbd>');
  });
});
