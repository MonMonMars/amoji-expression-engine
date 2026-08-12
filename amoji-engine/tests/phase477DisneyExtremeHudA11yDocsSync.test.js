import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 477 Extreme HUD a11y docs sync', () => {
  it('syncs readme/docs notes and preserves Extreme button count', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    expect(readme).toContain('| Phase 477 | Extreme HUD a11y docs sync | Done |');
    const md = readFileSync(join(root, 'prototypes/FACE_LIVE.md'), 'utf8');
    expect(md).toContain('HUD spark aria labels');
    expect(md).toContain('focus-visible polish');
    const html = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    const buttons = [...html.matchAll(/<button[^>]*id="(btnDisneyExtreme[^"]+)"[^>]*>/g)];
    expect(buttons.length).toBe(183);
  });
});
