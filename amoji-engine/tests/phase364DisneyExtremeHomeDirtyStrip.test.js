import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 364 Extreme Home dirty strip flash', () => {
  it('resolves Home and wires Face Live dirty strip flash', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'Home' }).action).toBe(
      'showBaselineDirtyStrip',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'End' }).action).toBe(
      'copyBaselineDirtyStrip',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Home dirty strip');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeDirtyStrip');
    expect(src).toContain('function flashDisneyExtremeBaselineDirtyStrip');
    expect(src).toContain("resolved.action === 'showBaselineDirtyStrip'");
  });
});
