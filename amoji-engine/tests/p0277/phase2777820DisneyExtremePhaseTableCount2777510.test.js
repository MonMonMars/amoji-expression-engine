import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
describe('Phase 2777820 Extreme phaseTableCount2777510', () => {
  it('has 24576 phase-doc rows for 2777510-2802085', () => {
    const startDoc = Math.floor(2777510 / 50000);
    const endDoc = Math.floor(2802085 / 50000);
    const readme = [];
    for (let i = startDoc; i <= endDoc; i += 1) {
      readme.push(readFileSync(join(root, 'docs/phases', 'phases-' + String(i).padStart(3, '0') + '.md'), 'utf8'));
    }
    const text = readme.join('\n');
    const rows = [...text.matchAll(/\| Phase (\d+) \|/g)]
      .map((m) => Number(m[1]))
      .filter((n) => n >= 2777510 && n <= 2802085);
    expect(new Set(rows).size).toBe(24576);
  }, 30000);
});
