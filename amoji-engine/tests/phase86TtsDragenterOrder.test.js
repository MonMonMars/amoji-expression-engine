import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 86 TTS dragenter ordering', () => {
  it('sets ttsEndpointDragActive before persistPrefs', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    const dragEnterIdx = src.indexOf("addEventListener('dragenter'");
    expect(dragEnterIdx).toBeGreaterThanOrEqual(0);

    const setActiveIdx = src.indexOf('ttsEndpointDragActive = true;', dragEnterIdx);
    expect(setActiveIdx).toBeGreaterThan(dragEnterIdx);

    const persistIdx = src.indexOf('persistPrefs();', setActiveIdx);
    expect(persistIdx).toBeGreaterThan(setActiveIdx);
  });
});

