import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 217 Extreme Face Live share link wiring', () => {
  it('wires Y hotkey, button, hash apply, and intensity apply', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('buildDisneyExtremeSnapshotShareUrl');
    expect(src).toContain('loadDisneyExtremeSnapshotFromHash');
    expect(src).toContain('function copyDisneyExtremeSnapshotShareUrl');
    expect(src).toContain('function applyDisneyExtremeSnapshotFromHash');
    expect(src).toContain("resolved.action === 'copySnapshotShareUrl'");
    expect(src).toContain('btnDisneyExtremeShare');
    expect(src).toContain('applyIntensity: true');
    expect(src).toContain('if (!applyDisneyExtremeSnapshotFromHash())');
  });
});
