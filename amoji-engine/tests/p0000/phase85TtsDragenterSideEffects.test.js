import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 85 TTS dragenter side effects', () => {
  it('sets active and persists on first dragenter', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dragEnterIdx = src.indexOf("addEventListener('dragenter'");
    expect(dragEnterIdx).toBeGreaterThanOrEqual(0);
    expect(src).toContain('ev.preventDefault();', dragEnterIdx);

    const guardIdx = src.indexOf('if (ttsEndpointDragActive) return;', dragEnterIdx);
    expect(guardIdx).toBeGreaterThan(dragEnterIdx);

    const setTrueIdx = src.indexOf('ttsEndpointDragActive = true;', guardIdx);
    expect(setTrueIdx).toBeGreaterThan(guardIdx);

    const cancelIdx = src.indexOf(
      "cancelActiveCompoundLifecycle('tts_endpoint_drag_pick')",
      setTrueIdx,
    );
    expect(cancelIdx).toBeGreaterThan(setTrueIdx);

    expect(src).toContain('persistPrefs();', cancelIdx);
    expect(src).toContain('syncGatewayHealthPoll();', cancelIdx);
  });
});

