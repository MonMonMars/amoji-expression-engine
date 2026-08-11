import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 143 Extreme HUD mini body mix spark', () => {
  it('renders compact body mix spark beside the B pill', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="hudBodySpark"');
    expect(src).toContain('class="pill pill-b"');
    expect(src).toContain('.hud-body-spark');
    expect(src).toContain(
      "hudBodySpark.classList.toggle('is-off', !bodyMixOn)",
    );
    expect(src).toContain('buildDisneyExtremeBodyMixSparkSvg({\n            markerT: bodyMixOn ? bodyInt');
  });
});
