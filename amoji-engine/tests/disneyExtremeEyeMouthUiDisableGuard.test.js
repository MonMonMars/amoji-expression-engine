import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Disney Extreme eye/mouth UI disable + guard', () => {
  it('disables eye/mouth sliders when master is off and only multiplies when enabled', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    expect(src).toContain('const masterOn = !!disneyExtremeEl?.checked;');
    expect(src).toContain('disneyExtremeEyeFactorEl.disabled = !masterOn;');
    expect(src).toContain('disneyExtremeMouthFactorEl.disabled = !masterOn;');

    expect(src).toContain('if (disneyExtremeOn) {');
    expect(src).toContain('for (const [k, v] of Object.entries(targets || {}))');
  });
});

