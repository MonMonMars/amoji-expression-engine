import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 84 TTS drag-leave resets active flag', () => {
  it('sets ttsEndpointDragActive = false on dragleave before cancel', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dragLeaveIdx = src.indexOf("addEventListener('dragleave'");
    expect(dragLeaveIdx).toBeGreaterThanOrEqual(0);

    const setFalseIdx = src.indexOf('ttsEndpointDragActive = false;', dragLeaveIdx);
    expect(setFalseIdx).toBeGreaterThan(dragLeaveIdx);

    const cancelIdx = src.indexOf(
      "cancelActiveCompoundLifecycle('tts_endpoint_drag_leave_pick')",
      dragLeaveIdx,
    );
    expect(cancelIdx).toBeGreaterThan(setFalseIdx);
  });
});

