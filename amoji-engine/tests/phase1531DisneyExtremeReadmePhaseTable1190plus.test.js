import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
describe('Phase 1531 Extreme readmePhaseTable1190plus', () => {
  it('documents phases 1190-1957 in README', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('readme · phase table 1190+');
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    expect(readme).toContain('| Phase 1190 |');
    expect(readme).toContain('| Phase 1957 |');
  });
});
