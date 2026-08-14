import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
describe('Phase 3097279 Extreme readmePhaseTable3096998plus', () => {
  it('documents phases 3096998-3121573 in phase docs', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('readme · phase table 3096998+');
    const startDoc = Math.floor(3096998 / 50000);
    const endDoc = Math.floor(3121573 / 50000);
    const readme = [];
    for (let i = startDoc; i <= endDoc; i += 1) {
      readme.push(readFileSync(join(root, 'docs/phases', 'phases-' + String(i).padStart(3, '0') + '.md'), 'utf8'));
    }
    const text = readme.join('\n');
    expect(text).toContain('| Phase 3096998 |');
    expect(text).toContain('| Phase 3121573 |');
  }, 30000);
});
