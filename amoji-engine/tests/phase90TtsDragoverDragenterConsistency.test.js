import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

function blockContains(src, anchor, needle) {
  const idx = src.indexOf(anchor);
  if (idx < 0) return false;
  const end = src.indexOf('});', idx);
  const slice = end > idx ? src.slice(idx, end) : src.slice(idx);
  return slice.includes(needle);
}

describe('Phase 90 TTS dragover/dragenter consistency', () => {
  it('both handlers persist/sync and cancel with same reason', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dragOverAnchor = "ttsEndpointEl?.addEventListener('dragover'";
    const dragEnterAnchor = "ttsEndpointEl?.addEventListener('dragenter'";

    // dragover
    expect(blockContains(src, dragOverAnchor, 'ev.preventDefault();')).toBe(true);
    expect(blockContains(src, dragOverAnchor, "cancelActiveCompoundLifecycle('tts_endpoint_drag_pick')")).toBe(true);
    expect(blockContains(src, dragOverAnchor, 'persistPrefs();')).toBe(true);
    expect(blockContains(src, dragOverAnchor, 'syncGatewayHealthPoll();')).toBe(true);

    // dragenter
    expect(blockContains(src, dragEnterAnchor, 'ev.preventDefault();')).toBe(true);
    expect(blockContains(src, dragEnterAnchor, "cancelActiveCompoundLifecycle('tts_endpoint_drag_pick')")).toBe(true);
    expect(blockContains(src, dragEnterAnchor, 'persistPrefs();')).toBe(true);
    expect(blockContains(src, dragEnterAnchor, 'syncGatewayHealthPoll();')).toBe(true);
  });
});

