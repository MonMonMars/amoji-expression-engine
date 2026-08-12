import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase 516 Extreme readme phase table', () => {
  it('documents phases 494-515 in README', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    expect(readme).toContain('| Phase 494 | Extreme bind helper paste | Done |');
    expect(readme).toContain('| Phase 515 | Extreme bind migration audit | Done |');
    expect(readme).not.toContain('Phase 494+ | Further production polish');
  });
});
