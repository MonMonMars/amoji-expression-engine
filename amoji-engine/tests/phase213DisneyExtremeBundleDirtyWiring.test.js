import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 213 Extreme Face Live bundle dirty wiring', () => {
  it('passes baseline into A / ⇧A bundle label', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain(
      'formatDisneyExtremeBundleLabel(disneyExtremeSnapshot(), {',
    );
    expect(src).toContain('baseline: lastExtremeBaselineSnap');
  });
});
