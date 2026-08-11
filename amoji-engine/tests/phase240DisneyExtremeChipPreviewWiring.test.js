import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 240 Extreme Face Live Meta chip preview', () => {
  it('wires Meta+click chip preview and catalog note', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('formatDisneyExtremeBaselineChipPreviewLabel');
    expect(src).toContain('ev.metaKey');
    expect(src).toContain("kind: 'redo'");
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Meta+click chip preview');
  });
});
