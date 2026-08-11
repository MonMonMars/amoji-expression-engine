import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Disney Extreme bodyInt clamp + wiring', () => {
  it('computes bodyInt and passes it to bodyCtl.tick', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    expect(src).toContain(
      'const bodyInt = Math.min(2.0, displayInt * (bodyOn ? bodyFactor : 1));',
    );
    expect(src).toContain('const bodyOn = disneyExtremeOn && (disneyExtremeBodyEl?.checked || false);');
    expect(src).toContain('intensity: bodyInt');
    // Sanity: ensure bodyCtl.tick uses the new variable.
    const bodyTickIdx = src.indexOf('const bodyState = bodyCtl.tick');
    expect(bodyTickIdx).toBeGreaterThanOrEqual(0);
    const bodySlice = src.slice(bodyTickIdx, Math.min(src.length, bodyTickIdx + 500));
    expect(bodySlice).toContain('intensity: bodyInt');
  });
});

