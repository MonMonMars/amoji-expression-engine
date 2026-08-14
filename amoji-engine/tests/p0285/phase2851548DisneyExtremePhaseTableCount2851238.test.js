import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
describe('Phase 2851548 Extreme phaseTableCount2851238', () => {
  it('has 24576 phase-doc rows for 2851238-2875813', () => {
    const startDoc = Math.floor(2851238 / 50000);
    const endDoc = Math.floor(2875813 / 50000);
    const readme = [];
    for (let i = startDoc; i <= endDoc; i += 1) {
      readme.push(readFileSync(join(root, 'docs/phases', 'phases-' + String(i).padStart(3, '0') + '.md'), 'utf8'));
    }
    const text = readme.join('\n');
    const rows = [...text.matchAll(/\| Phase (\d+) \|/g)]
      .map((m) => Number(m[1]))
      .filter((n) => n >= 2851238 && n <= 2875813);
    expect(new Set(rows).size).toBe(24576);
  }, 30000);
});
