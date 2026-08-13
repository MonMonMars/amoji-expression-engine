import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 211 Extreme Face Live auto-baseline wiring', () => {
  it('wires maybeAutoBaseline on Extreme change + silent init', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('shouldAutoCaptureDisneyExtremeBaseline');
    expect(src).toContain('function maybeAutoBaselineDisneyExtreme');
    expect(src).toContain('maybeAutoBaselineDisneyExtreme()');
    expect(src).toContain("maybeAutoBaselineDisneyExtreme({ silent: true })");
    expect(src).toContain('auto base · fp');
  });
});
