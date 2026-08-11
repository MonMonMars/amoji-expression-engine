import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 169 Extreme Face Live paste JSON wiring', () => {
  it('wires paste button, apply helper, and Shift+J flash', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="btnDisneyExtremePasteJson"');
    expect(src).toContain('async function pasteDisneyExtremeSnapshotJson()');
    expect(src).toContain('function applyDisneyExtremeSnapshot(snap');
    expect(src).toContain("resolved.action === 'pasteSnapshotJson'");
    expect(src).toContain('parseDisneyExtremeSnapshot');
    expect(src).toContain('disneyExtremeSnapshotFingerprintShort');
    expect(src).toContain('pasted · snapshot JSON · fp');
    expect(src).toContain('copied · snapshot JSON · fp');
    expect(src).toContain('<kbd>⇧J</kbd>');
  });
});
