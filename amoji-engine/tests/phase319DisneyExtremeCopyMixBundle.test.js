import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { formatDisneyExtremeBodyMixBundle } from '../engine/layers/neckShoulder.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 319 Extreme ⇧Alt+M copy mix+svg', () => {
  it('resolves ⇧Alt+M and wires Face Live mix label+SVG bundle copy', () => {
    const text = formatDisneyExtremeBodyMixBundle({
      enabled: true,
      bodyOn: true,
      markerT: 1.1,
    });
    expect(text).toContain('mix ');
    expect(text).toContain('<svg');
    expect(
      resolveDisneyExtremeHotkey({
        key: 'm',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyBodyMixBundle');
    expect(
      resolveDisneyExtremeHotkey({ key: 'm', altKey: true }).action,
    ).toBe('copyBodyMixLabel');
    expect(
      resolveDisneyExtremeHotkey({ key: 'm', shiftKey: true }).action,
    ).toBe('copyBodyMixCurve');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+M copy mix+svg');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyMixBundle');
    expect(src).toContain('function copyDisneyExtremeBodyMixBundle');
    expect(src).toContain("resolved.action === 'copyBodyMixBundle'");
    expect(src).toContain('formatDisneyExtremeBodyMixBundle(');
  });
});
