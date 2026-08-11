import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 87 TTS dragenter cancel before persist', () => {
  it('calls cancelActiveCompoundLifecycle before persistPrefs', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    const dragEnterIdx = src.indexOf("addEventListener('dragenter'");
    expect(dragEnterIdx).toBeGreaterThanOrEqual(0);

    const cancelIdx = src.indexOf(
      "cancelActiveCompoundLifecycle('tts_endpoint_drag_pick')",
      dragEnterIdx,
    );
    expect(cancelIdx).toBeGreaterThan(dragEnterIdx);

    const persistIdx = src.indexOf('persistPrefs();', cancelIdx);
    expect(persistIdx).toBeGreaterThan(cancelIdx);
  });
});

