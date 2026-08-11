import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 300 Extreme Alt+M copy mix label', () => {
  it('resolves Alt+M and wires Face Live body mix label copy', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'm', altKey: true }).action,
    ).toBe('copyBodyMixLabel');
    expect(resolveDisneyExtremeHotkey({ key: 'm' }).action).toBe(
      'showBodyMix',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'm', shiftKey: true }).action,
    ).toBe('copyBodyMixCurve');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+M copy mix label');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyMixLabel');
    expect(src).toContain('function copyDisneyExtremeBodyMixLabel');
    expect(src).toContain("resolved.action === 'copyBodyMixLabel'");
    expect(src).toContain('formatDisneyExtremeBodyMixLabel({');
  });
});
