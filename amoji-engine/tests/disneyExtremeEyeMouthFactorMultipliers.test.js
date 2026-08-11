import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Disney Extreme eye/mouth factor multipliers', () => {
  it('applies multipliers to eye/iris and mouth morph targets when enabled', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');

    expect(src).toContain('id="disneyExtremeEyeFactor"');
    expect(src).toContain('id="disneyExtremeMouthFactor"');

    expect(src).toContain('const disneyEyeFactor');
    expect(src).toContain('const disneyMouthFactor');

    // Coarse category rules
    expect(src).toContain("const isEye =");
    expect(src).toContain("k.includes('eye')");
    expect(src).toContain("k.includes('iris')");
    expect(src).toContain("k.includes('pupil')");
    expect(src).toContain("k.includes('brow')");
    expect(src).toContain("k.includes('lid')");
    expect(src).toContain('targets[k] = Math.min(2.0, v * disneyEyeFactor)');
    expect(src).toContain("const isMouth =");
    expect(src).toContain("k.includes('mouth')");
    expect(src).toContain("k.includes('lip')");
    expect(src).toContain("k.includes('jaw')");
    expect(src).toContain('targets[k] = Math.min(2.0, v * disneyMouthFactor)');
  });
});

