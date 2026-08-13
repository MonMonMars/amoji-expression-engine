import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 469 Extreme pill/history/favorites docs sync', () => {
  it('tracks phase rows and retains Extreme button tooltip count', () => {
    const readme = readdirSync(join(root, 'docs/phases')).filter((x) => x.endsWith('.md')).map((x) => readFileSync(join(root, 'docs/phases', x), 'utf8')).join('\n');
    expect(readme).toContain('| Phase 469 | Extreme pill/history/favorites docs sync | Done |');
    const md = readFileSync(join(root, 'prototypes/FACE_LIVE.md'), 'utf8');
    expect(md).toContain('X pill ⇧Enter/dbl-click copy diff');
    expect(md).toContain('history/favorites background click');
    const html = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    const buttons = [...html.matchAll(/<button[^>]*id="(btnDisneyExtreme[^"]+)"[^>]*>/g)];
    expect(buttons.length).toBe(183);
  });
});
