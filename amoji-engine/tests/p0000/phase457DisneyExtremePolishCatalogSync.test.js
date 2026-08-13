import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 457 Extreme polish catalog sync', () => {
  it('keeps docs/tests aligned with 183 button tooltip coverage', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    const buttons = [...src.matchAll(/<button[^>]*id="(btnDisneyExtreme[^"]+)"[^>]*>/g)];
    expect(buttons.length).toBe(183);
    for (const m of buttons) {
      expect(m[0], m[1]).toContain('title="');
    }
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('sparks · dbl-click copy');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Tab focus panel · button');
    const readme = readdirSync(join(root, 'docs/phases')).filter((x) => x.endsWith('.md')).map((x) => readFileSync(join(root, 'docs/phases', x), 'utf8')).join('\n');
    expect(readme).toContain('| Phase 457 | Extreme catalog/test/docs sync polish | Done |');
  });
});
