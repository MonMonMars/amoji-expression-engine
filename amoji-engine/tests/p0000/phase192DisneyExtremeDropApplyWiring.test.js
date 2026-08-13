import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 192 Extreme Face Live drop apply wiring', () => {
  it('wires panel drop zone and apply path', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremePanel"');
    expect(src).toContain('id="disneyExtremeDropHint"');
    expect(src).toContain('#disneyExtremePanel.dragover');
    expect(src).toContain('async function handleDisneyExtremeSnapshotDrop');
    expect(src).toContain('async function readDisneyExtremeDropText');
    expect(src).toContain('dropped · snapshot JSON · fp');
    expect(src).toContain("ev.dataTransfer.dropEffect = 'copy'");
  });
});
