import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 184 Extreme X pill click flashes diff', () => {
  it('wires pillExtreme click/keyboard to snapshot diff', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(pillExtreme');
    expect(src).toContain('flashDisneyExtremeSnapshotDiff()');
    expect(src).toContain("setAttribute('role', 'button')");
    expect(src).toContain("setAttribute('tabindex', '0')");
    expect(src).toContain('.pill.pill-x:focus-visible');
  });
});
