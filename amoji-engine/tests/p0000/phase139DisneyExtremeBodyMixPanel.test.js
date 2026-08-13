import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 139 Extreme body mix spark panel wiring', () => {
  it('wires body mix spark + label beside Extreme controls', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="disneyExtremeBodySpark"');
    expect(src).toContain('id="disneyExtremeBodyMixLabel"');
    expect(src).toContain('buildDisneyExtremeBodyMixSparkSvg');
    expect(src).toContain('formatDisneyExtremeBodyMixLabel');
    expect(src).toContain(
      "disneyExtremeBodySpark.classList.toggle('is-off', !bodyMixOn)",
    );
    expect(src).toContain('.extreme-body-spark');
  });
});
