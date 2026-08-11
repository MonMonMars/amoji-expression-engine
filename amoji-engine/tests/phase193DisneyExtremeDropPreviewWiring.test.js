import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 193 Extreme Face Live Meta drop preview', () => {
  it('wires Meta preview path without applying', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('formatDisneyExtremeSnapshotPreviewLabel');
    expect(src).toContain('!!opts.preview || !!ev.metaKey');
    expect(src).toContain('Drop snapshot / hist JSON · Meta preview · dbl-click paste');
  });
});
