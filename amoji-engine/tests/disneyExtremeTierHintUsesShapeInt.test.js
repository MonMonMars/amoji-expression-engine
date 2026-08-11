import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Disney Extreme tier hint uses shapeInt', () => {
  it('updates tierHint using tierLabel(shapeInt) when slider changes', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('function updateTierHintForDisneyExtreme()');
    expect(src).toContain('const shapeInt = Math.min(2.0, intensity * shapeFactor);');
    expect(src).toContain('shape ${shapeInt.toFixed(2)}');
    expect(src).toContain('updateTierHintForDisneyExtreme();');
  });
});

