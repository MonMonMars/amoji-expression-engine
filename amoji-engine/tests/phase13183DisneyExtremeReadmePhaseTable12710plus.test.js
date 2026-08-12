import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase 13183 Extreme readmePhaseTable12710plus', () => {
  it('documents phases 12710-24997 in README', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('readme · phase table 12710+');
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    expect(readme).toContain('| Phase 12710 |');
    expect(readme).toContain('| Phase 24997 |');
  });
});
