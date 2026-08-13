import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 301 Extreme Alt+N copy neck label', () => {
  it('resolves Alt+N and wires Face Live neck label copy', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'n', altKey: true }).action,
    ).toBe('copyNeckLabel');
    expect(resolveDisneyExtremeHotkey({ key: 'n' }).action).toBe(
      'showNeckBlend',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+N copy neck');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyNeckLabel');
    expect(src).toContain('function copyDisneyExtremeNeckLabel');
    expect(src).toContain("resolved.action === 'copyNeckLabel'");
    expect(src).toContain('formatDisneyExtremeNeckLabel({');
  });
});
