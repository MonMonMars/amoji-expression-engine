import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
describe('Phase 2630364 Extreme phaseTableCount2630054', () => {
  it('has 24576 phase-doc rows for 2630054-2654629', () => {
    const startDoc = Math.floor(2630054 / 50000);
    const endDoc = Math.floor(2654629 / 50000);
    const readme = [];
    for (let i = startDoc; i <= endDoc; i += 1) {
      readme.push(readFileSync(join(root, 'docs/phases', 'phases-' + String(i).padStart(3, '0') + '.md'), 'utf8'));
    }
    const text = readme.join('\n');
    const rows = [...text.matchAll(/\| Phase (\d+) \|/g)]
      .map((m) => Number(m[1]))
      .filter((n) => n >= 2630054 && n <= 2654629);
    expect(new Set(rows).size).toBe(24576);
  }, 30000);
});
