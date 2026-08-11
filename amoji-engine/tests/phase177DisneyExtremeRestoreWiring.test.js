import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 177 Extreme Face Live restore baseline wiring', () => {
  it('wires restore button, helper, and Shift+D action', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="btnDisneyExtremeRestore"');
    expect(src).toContain('function restoreDisneyExtremeBaseline()');
    expect(src).toContain("resolved.action === 'restoreBaseline'");
    expect(src).toContain('restore · no baseline');
    expect(src).toContain('restored · baseline · fp');
    expect(src).toContain('<kbd>⇧D</kbd>');
  });
});
