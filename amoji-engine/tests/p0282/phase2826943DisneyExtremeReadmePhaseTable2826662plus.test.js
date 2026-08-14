import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
describe('Phase 2826943 Extreme readmePhaseTable2826662plus', () => {
  it('documents phases 2826662-2851237 in phase docs', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('readme · phase table 2826662+');
    const startDoc = Math.floor(2826662 / 50000);
    const endDoc = Math.floor(2851237 / 50000);
    const readme = [];
    for (let i = startDoc; i <= endDoc; i += 1) {
      readme.push(readFileSync(join(root, 'docs/phases', 'phases-' + String(i).padStart(3, '0') + '.md'), 'utf8'));
    }
    const text = readme.join('\n');
    expect(text).toContain('| Phase 2826662 |');
    expect(text).toContain('| Phase 2851237 |');
  }, 30000);
});
