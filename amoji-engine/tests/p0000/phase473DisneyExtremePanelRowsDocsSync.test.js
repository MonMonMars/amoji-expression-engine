import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 473 Extreme panel/rows docs sync', () => {
  it('syncs phase rows/docs text and keeps Extreme button count stable', () => {
    const readme = readdirSync(join(root, 'docs/phases')).filter((x) => x.endsWith('.md')).map((x) => readFileSync(join(root, 'docs/phases', x), 'utf8')).join('\n');
    expect(readme).toContain('| Phase 473 | Extreme panel/rows docs sync | Done |');
    const md = readFileSync(join(root, 'prototypes/FACE_LIVE.md'), 'utf8');
    expect(md).toContain('panel background click/dbl-click');
    expect(md).toContain('history/favorites background click');
    const html = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    const buttons = [...html.matchAll(/<button[^>]*id="(btnDisneyExtreme[^"]+)"[^>]*>/g)];
    expect(buttons.length).toBe(183);
  });
});
