import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 237 Extreme Face Live clear hist + redo jump wiring', () => {
  it('wires Shift+K, Shift+digit redo jump, and clear hist button', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeClearHist');
    expect(src).toContain("resolved.action === 'clearBaselineHistory'");
    expect(src).toContain('clearDisneyExtremeBaselineHistoryOnly()');
    expect(src).toContain("resolved.action === 'jumpBaselineRedo'");
    expect(src).toContain('jumpDisneyExtremeBaselineRedo(resolved.index)');
  });
});
