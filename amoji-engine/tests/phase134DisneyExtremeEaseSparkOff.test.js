import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 134 Extreme ease spark off-state', () => {
  it('toggles is-off on panel spark when Extreme is disabled', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('.extreme-ease-spark.is-off');
    expect(src).toContain(
      "disneyExtremeEaseSpark.classList.toggle('is-off', !disneyExtremeOn)",
    );
    expect(src).toContain(
      "stroke: disneyExtremeOn ? undefined : 'rgba(126,200,255,0.45)'",
    );
  });
});
