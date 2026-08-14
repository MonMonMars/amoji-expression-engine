import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
describe('Phase 3023551 Extreme readmePhaseTable3023270plus', () => {
  it('documents phases 3023270-3047845 in phase docs', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('readme · phase table 3023270+');
    const startDoc = Math.floor(3023270 / 50000);
    const endDoc = Math.floor(3047845 / 50000);
    const readme = [];
    for (let i = startDoc; i <= endDoc; i += 1) {
      readme.push(readFileSync(join(root, 'docs/phases', 'phases-' + String(i).padStart(3, '0') + '.md'), 'utf8'));
    }
    const text = readme.join('\n');
    expect(text).toContain('| Phase 3023270 |');
    expect(text).toContain('| Phase 3047845 |');
  }, 30000);
});
