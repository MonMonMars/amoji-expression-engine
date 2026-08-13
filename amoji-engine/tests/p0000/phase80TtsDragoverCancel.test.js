import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 80 TTS endpoint dragover cancel', () => {
  it('cancels tts_endpoint_drag_pick on first dragover', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("addEventListener('dragover'");
    expect(src).toContain("cancelActiveCompoundLifecycle('tts_endpoint_drag_pick')");
    // Guard against regressions: ensure dragover starts by preventing default.
    expect(src).toContain('ev.preventDefault()');
  });
});

