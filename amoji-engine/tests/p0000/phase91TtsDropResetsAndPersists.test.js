import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 91 TTS drop resets and persists', () => {
  it('sets active false, cancels drag_pick, persists and syncs on drop', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dropAnchor = "addEventListener('drop'";
    const dropIdx = src.indexOf(dropAnchor);
    expect(dropIdx).toBeGreaterThanOrEqual(0);

    const setFalseIdx = src.indexOf('ttsEndpointDragActive = false;', dropIdx);
    expect(setFalseIdx).toBeGreaterThan(dropIdx);

    const cancelIdx = src.indexOf(
      "cancelActiveCompoundLifecycle('tts_endpoint_drag_pick')",
      dropIdx,
    );
    expect(cancelIdx).toBeGreaterThan(setFalseIdx);

    const persistIdx = src.indexOf('persistPrefs();', cancelIdx);
    expect(persistIdx).toBeGreaterThan(cancelIdx);

    const syncIdx = src.indexOf('syncGatewayHealthPoll();', persistIdx);
    expect(syncIdx).toBeGreaterThan(persistIdx);
  });
});

