import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 208 Extreme Face Live redo wiring', () => {
  it('wires redo stack persist, undo push, Shift+U, and button', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('loadDisneyExtremeBaselineRedo');
    expect(src).toContain('saveDisneyExtremeBaselineRedo');
    expect(src).toContain('clearDisneyExtremeBaselineRedoStorage');
    expect(src).toContain('extremeBaselineRedo');
    expect(src).toContain('function redoDisneyExtremeBaseline');
    expect(src).toContain("resolved.action === 'redoBaseline'");
    expect(src).toContain('btnDisneyExtremeRedoBase');
    expect(src).toContain('clearDisneyExtremeBaselineRedoStack');
  });
});
