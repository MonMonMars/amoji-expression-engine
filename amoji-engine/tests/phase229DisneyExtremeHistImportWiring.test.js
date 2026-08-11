import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 229 Extreme Face Live hist import wiring', () => {
  it('wires paste hist, drop auto-detect, and apply helper', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('parseDisneyExtremeBaselineHistory');
    expect(src).toContain('formatDisneyExtremeBaselineHistoryPreviewLabel');
    expect(src).toContain('function applyDisneyExtremeBaselineHistory');
    expect(src).toContain('function pasteDisneyExtremeBaselineHistoryJson');
    expect(src).toContain('btnDisneyExtremePasteHist');
    expect(src).toContain("resolved.action === 'pasteBaselineHistoryJson'");
    expect(src).toContain('imported · hist');
  });
});
