import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase 3967 Extreme readmePhaseTable3494plus', () => {
  it('documents phases 3494-6565 in README', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('readme · phase table 3494+');
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    expect(readme).toContain('| Phase 3494 |');
    expect(readme).toContain('| Phase 6565 |');
  });
});
