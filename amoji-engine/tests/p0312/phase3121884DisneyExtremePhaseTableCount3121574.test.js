import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
describe('Phase 3121884 Extreme phaseTableCount3121574', () => {
  it('has 24576 phase-doc rows for 3121574-3146149', () => {
    const startDoc = Math.floor(3121574 / 50000);
    const endDoc = Math.floor(3146149 / 50000);
    const readme = [];
    for (let i = startDoc; i <= endDoc; i += 1) {
      readme.push(readFileSync(join(root, 'docs/phases', 'phases-' + String(i).padStart(3, '0') + '.md'), 'utf8'));
    }
    const text = readme.join('\n');
    const rows = [...text.matchAll(/\| Phase (\d+) \|/g)]
      .map((m) => Number(m[1]))
      .filter((n) => n >= 3121574 && n <= 3146149);
    expect(new Set(rows).size).toBe(24576);
  }, 30000);
});
