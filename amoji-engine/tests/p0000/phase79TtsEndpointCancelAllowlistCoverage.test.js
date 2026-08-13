import { describe, expect, it } from 'vitest';

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 79 TTS endpoint cancel allowlist coverage', () => {
  it('includes all TTS drag lifecycle reasons', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    // This allowlist controls whether fingerStatus shows a generic
    // "lifecycle cancelled" message for common UI drag states.
    expect(src).toContain("reason !== 'tts_endpoint_drag_pick'");
    expect(src).toContain("reason !== 'tts_endpoint_drag_start_pick'");
    expect(src).toContain("reason !== 'tts_endpoint_drag_end_pick'");
    expect(src).toContain("reason !== 'tts_endpoint_drag_leave_pick'");
  });
});

