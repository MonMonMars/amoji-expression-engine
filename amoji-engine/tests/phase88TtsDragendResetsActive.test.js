import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 88 TTS dragend resets active flag', () => {
  it('sets ttsEndpointDragActive = false on dragend and cancels', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dragEndIdx = src.indexOf("addEventListener('dragend'");
    expect(dragEndIdx).toBeGreaterThanOrEqual(0);

    const setFalseIdx = src.indexOf('ttsEndpointDragActive = false;', dragEndIdx);
    expect(setFalseIdx).toBeGreaterThan(dragEndIdx);

    const cancelIdx = src.indexOf(
      "cancelActiveCompoundLifecycle('tts_endpoint_drag_end_pick')",
      dragEndIdx,
    );
    expect(cancelIdx).toBeGreaterThan(setFalseIdx);
  });
});

