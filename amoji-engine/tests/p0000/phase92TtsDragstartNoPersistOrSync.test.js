import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 92 TTS dragstart no persist/sync', () => {
  it('does not call persistPrefs or syncGatewayHealthPoll inside dragstart', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    const dragStartAnchor = "addEventListener('dragstart'";
    const idx = src.indexOf(dragStartAnchor);
    expect(idx).toBeGreaterThanOrEqual(0);

    const nextIdx = src.indexOf("addEventListener('dragenter'", idx);
    expect(nextIdx).toBeGreaterThanOrEqual(0);

    const block = src.slice(idx, nextIdx);
    expect(block).toContain("cancelActiveCompoundLifecycle('tts_endpoint_drag_start_pick')");
    expect(block).not.toContain('persistPrefs();');
    expect(block).not.toContain('syncGatewayHealthPoll();');
  });
});

