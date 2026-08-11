import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 82 TTS dragover sets active flag', () => {
  it('sets ttsEndpointDragActive = true on first dragover', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const hasGuard = src.includes('if (ttsEndpointDragActive) return;');
    const hasSetActive = src.includes('ttsEndpointDragActive = true;');
    const hasCancel = src.includes("cancelActiveCompoundLifecycle('tts_endpoint_drag_pick')");

    expect(hasGuard).toBe(true);
    expect(hasSetActive).toBe(true);
    expect(hasCancel).toBe(true);
  });
});

