import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 201 Extreme Face Live undo baseline wiring', () => {
  it('wires Undo button, U action, and history pop apply', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="btnDisneyExtremeUndoBase"');
    expect(src).toContain('function undoDisneyExtremeBaseline()');
    expect(src).toContain("resolved.action === 'undoBaseline'");
    expect(src).toContain('popDisneyExtremeBaselineHistory');
    expect(src).toContain('undone · baseline · fp');
    expect(src).toContain('undo · no history');
    expect(src).toContain('extremeBaselineHistory = []');
    expect(src).toContain('<kbd>U</kbd>');
  });
});
