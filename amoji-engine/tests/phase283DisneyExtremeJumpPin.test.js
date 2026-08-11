import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 283 Extreme Alt+R jump pin', () => {
  it('resolves Alt+R and wires Face Live jump pin', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'r', altKey: true }).action,
    ).toBe('jumpBaselinePin');
    expect(resolveDisneyExtremeHotkey({ key: 'r' }).action).toBe(
      'resetDefaults',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+R jump pin');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpPin');
    expect(src).toContain('function jumpDisneyExtremeBaselinePin');
    expect(src).toContain("resolved.action === 'jumpBaselinePin'");
    expect(src).toContain('pin · jump');
    expect(src).toContain('pin · none');
  });
});
