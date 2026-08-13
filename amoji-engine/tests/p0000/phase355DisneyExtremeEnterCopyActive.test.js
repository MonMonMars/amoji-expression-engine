import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 355 Extreme Enter copy active', () => {
  it('resolves Enter and wires Face Live active clipboard copy', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'Enter' }).action).toBe(
      'copyBaselineActive',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'Enter', shiftKey: true }).action,
    ).toBe('showBaselinePinStrip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Enter copy active');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyActive');
    expect(src).toContain('function copyDisneyExtremeBaselineActive');
    expect(src).toContain("resolved.action === 'copyBaselineActive'");
  });
});
