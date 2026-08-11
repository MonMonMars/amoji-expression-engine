import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 225 Extreme Face Live redo chips + hist export wiring', () => {
  it('wires redo chips, jump, and Shift+L copy hist JSON', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('extreme-redo-chip');
    expect(src).toContain('function jumpDisneyExtremeBaselineRedo');
    expect(src).toContain('serializeDisneyExtremeBaselineHistory');
    expect(src).toContain('function copyDisneyExtremeBaselineHistoryJson');
    expect(src).toContain('btnDisneyExtremeCopyHist');
    expect(src).toContain("resolved.action === 'copyBaselineHistoryJson'");
    expect(src).toContain('redo · jump R#');
  });
});
