import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 460 Extreme interactive title refresh', () => {
  it('keeps title hints aligned with keyboard interactions', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('click/Enter/Space digest');
    expect(src).toContain('click/Enter/Space flash');
    expect(src).toContain('click/Enter/Space flash · dbl-click/⇧Enter copy');
  });
});
