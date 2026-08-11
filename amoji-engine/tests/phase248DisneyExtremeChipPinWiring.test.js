import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 248 Extreme Face Live dbl-click chip pin', () => {
  it('wires dbl-click chip pin without applying live jump', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('dbl-click chip pin');
    expect(src).toContain('function bindDisneyExtremeBaselineChip');
    expect(src).toContain('function pinDisneyExtremeBaselineFromChip');
    expect(src).toContain("addEventListener('dblclick'");
    expect(src).toContain('pinned · chip ·');
  });
});
