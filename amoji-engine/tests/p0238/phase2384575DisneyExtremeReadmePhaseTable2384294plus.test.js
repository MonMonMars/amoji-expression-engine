import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
describe('Phase 2384575 Extreme readmePhaseTable2384294plus', () => {
  it('documents phases 2384294-2408869 in phase docs', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('readme · phase table 2384294+');
    const readme = readdirSync(join(root, 'docs/phases')).filter((x) => x.endsWith('.md')).map((x) => readFileSync(join(root, 'docs/phases', x), 'utf8')).join('\n');
    expect(readme).toContain('| Phase 2384294 |');
    expect(readme).toContain('| Phase 2408869 |');
  });
});
