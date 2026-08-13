import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 197 Extreme dirty edge flash', () => {
  it('flashes baseline drift when dirty rises', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('let lastExtremeDirty = false');
    expect(src).toContain('dirtyHud.dirty && !lastExtremeDirty');
    expect(src).toContain('baseline drift');
    expect(src).toContain('lastExtremeDirty = dirtyHud.dirty');
    expect(src).toContain('lastExtremeDirty = false');
  });
});
