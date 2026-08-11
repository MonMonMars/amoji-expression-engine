import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 245 Extreme Face Live chip Alt-diff + redo JSON wiring', () => {
  it('wires Alt+click chip diff and O/⇧O redo JSON IO', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('formatDisneyExtremeBaselineChipDiffLabel');
    expect(src).toContain('ev.altKey');
    expect(src).toContain('serializeDisneyExtremeBaselineRedo');
    expect(src).toContain('parseDisneyExtremeBaselineRedo');
    expect(src).toContain('function copyDisneyExtremeBaselineRedoJson');
    expect(src).toContain('function pasteDisneyExtremeBaselineRedoJson');
    expect(src).toContain('btnDisneyExtremeCopyRedo');
    expect(src).toContain('btnDisneyExtremePasteRedo');
    expect(src).toContain("resolved.action === 'copyBaselineRedoJson'");
    expect(src).toContain("resolved.action === 'pasteBaselineRedoJson'");
    expect(src).toContain('${verb} · redo');
  });
});
