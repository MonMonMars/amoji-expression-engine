import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
describe('Phase 609 Extreme readme phase table', () => {
  it('documents phases 518-608 in README', () => {
    const readme = readdirSync(join(root, 'docs/phases')).filter((x) => x.endsWith('.md')).map((x) => readFileSync(join(root, 'docs/phases', x), 'utf8')).join('\n');
    expect(readme).toContain('| Phase 518 | Extreme skiprole for native/status | Done |');
    expect(readme).toContain('| Phase 608 | Extreme alt coarser | Done |');
    expect(readme).not.toContain('Phase 518+ | Further production polish');
  });
});
