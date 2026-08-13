import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 81 TTS dragover guard', () => {
  it('prevents repeated dragover cancellation', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    expect(src).toContain("addEventListener('dragover'");
    expect(src).toContain('if (ttsEndpointDragActive) return;');
    expect(src).toContain("cancelActiveCompoundLifecycle('tts_endpoint_drag_pick')");
  });
});

