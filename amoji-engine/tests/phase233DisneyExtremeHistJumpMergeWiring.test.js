import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 233 Extreme Face Live digit jump + merge wiring', () => {
  it('wires jump hotkey, merge paste/drop, and merge button', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain("resolved.action === 'jumpBaselineHistory'");
    expect(src).toContain('jumpDisneyExtremeBaselineHistory(resolved.index)');
    expect(src).toContain("resolved.action === 'mergeBaselineHistoryJson'");
    expect(src).toContain('pasteDisneyExtremeBaselineHistoryJson({ merge: true })');
    expect(src).toContain('merge: !!ev.shiftKey');
    expect(src).toContain('btnDisneyExtremeMergeHist');
    expect(src).toContain("opts.merge ? 'merged' : 'imported'");
    expect(src).toContain('${verb} · hist');
  });
});
