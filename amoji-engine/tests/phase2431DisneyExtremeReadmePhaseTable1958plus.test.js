import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase 2431 Extreme readmePhaseTable1958plus', () => {
  it('documents phases 1958-3493 in README', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('readme · phase table 1958+');
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    expect(readme).toContain('| Phase 1958 |');
    expect(readme).toContain('| Phase 3493 |');
  });
});
