import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 241 Extreme Face Live pin baseline wiring', () => {
  it('wires P hotkey, pin helper, and button', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function pinDisneyExtremeBaseline');
    expect(src).toContain("resolved.action === 'pinBaseline'");
    expect(src).toContain('btnDisneyExtremePinBase');
    expect(src).toContain('pinned · baseline · fp');
  });
});
