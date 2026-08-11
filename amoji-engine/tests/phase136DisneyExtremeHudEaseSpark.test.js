import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 136 Extreme HUD mini ease spark', () => {
  it('renders compact ease spark beside the X pill', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="hudExtremeSpark"');
    expect(src).toContain('class="pill pill-x"');
    expect(src).toContain('.hud-extreme-spark');
    expect(src).toContain(
      "hudExtremeSpark.classList.toggle('is-off', !disneyExtremeOn)",
    );
    expect(src).toContain('width: 52');
    expect(src).toContain('height: 16');
  });
});
