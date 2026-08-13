import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 464 Extreme strip title keyboard hints', () => {
  it('updates strip/filter titles with Enter/Space and Shift+Enter hints', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('click flash · dbl-click copy · Enter/Space flash · ⇧Enter copy');
    expect(src).toContain('dbl-click jump summary · Enter/Space flash · ⇧Enter jump summary');
    expect(src).toContain('filter-aware · click flash · dbl-click copy · Enter/Space flash · ⇧Enter copy');
  });
});
