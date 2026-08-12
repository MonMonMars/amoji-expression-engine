import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase 609 Extreme readme phase table', () => {
  it('documents phases 518-608 in README', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    expect(readme).toContain('| Phase 518 | Extreme skiprole for native/status | Done |');
    expect(readme).toContain('| Phase 608 | Extreme alt coarser | Done |');
    expect(readme).not.toContain('Phase 518+ | Further production polish');
  });
});
