import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 461 Extreme keyboard polish docs sync', () => {
  it('tracks phase table and tooltip coverage after keyboard polish', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    expect(readme).toContain('| Phase 461 | Extreme keyboard interaction docs sync | Done |');
    const faceLive = readFileSync(join(root, 'prototypes/FACE_LIVE.md'), 'utf8');
    expect(faceLive).toContain('status/drop hint Enter/Space');
    expect(faceLive).toContain('spark ⇧Enter copy');
    const html = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    const buttons = [...html.matchAll(/<button[^>]*id="(btnDisneyExtreme[^"]+)"[^>]*>/g)];
    expect(buttons.length).toBe(183);
  });
});
