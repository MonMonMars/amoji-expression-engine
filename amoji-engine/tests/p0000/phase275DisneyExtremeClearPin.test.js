import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 275 Extreme Alt+K clear pin only', () => {
  it('resolves Alt+K and wires Face Live clear pin', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'k', altKey: true }).action,
    ).toBe('clearBaselinePin');
    expect(resolveDisneyExtremeHotkey({ key: 'k' }).action).toBe(
      'clearBaseline',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'k', shiftKey: true }).action,
    ).toBe('clearBaselineHistory');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+K clear pin');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeClearPin');
    expect(src).toContain('function clearDisneyExtremeBaselinePinOnly');
    expect(src).toContain("resolved.action === 'clearBaselinePin'");
    expect(src).toContain('cleared · pin');
  });
});
