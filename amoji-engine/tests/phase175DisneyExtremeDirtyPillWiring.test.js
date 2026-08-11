import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 175 Extreme live dirty pill wiring', () => {
  it('appends dirty bit to X pill and toggles is-dirty', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('id="pillExtreme"');
    expect(src).toContain('formatDisneyExtremeDirtyHudBit');
    expect(src).toContain('pillExtreme?.classList.toggle(\'is-dirty\'');
    expect(src).toContain('.pill.pill-x.is-dirty');
    expect(src).toContain('${extremeHud.pill}${dirtyHud.bit}');
  });
});
