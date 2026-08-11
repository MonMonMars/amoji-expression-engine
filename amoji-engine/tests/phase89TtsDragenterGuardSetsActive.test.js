import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 89 TTS dragenter guard sets active', () => {
  it('has guard before setting ttsEndpointDragActive = true', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const anchor = "ttsEndpointEl?.addEventListener('dragenter'";
    const anchorIdx = src.indexOf(anchor);
    expect(anchorIdx).toBeGreaterThanOrEqual(0);

    const guardIdx = src.indexOf('if (ttsEndpointDragActive) return;', anchorIdx);
    expect(guardIdx).toBeGreaterThan(anchorIdx);

    const setTrueIdx = src.indexOf('ttsEndpointDragActive = true;', guardIdx);
    expect(setTrueIdx).toBeGreaterThan(guardIdx);
  });
});

