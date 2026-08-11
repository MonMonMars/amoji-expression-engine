import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 368 Extreme PageUp toggle strips', () => {
  it('resolves PageUp and wires Face Live strips toggle', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'PageUp' }).action).toBe(
      'toggleBaselineStrips',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'PageDown' }).action).toBe(
      'showBaselineStripsSummary',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('PageUp toggle strips');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeToggleStrips');
    expect(src).toContain('function toggleDisneyExtremeStrips');
    expect(src).toContain("resolved.action === 'toggleBaselineStrips'");
  });
});
