import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 317 Extreme Shift+R reset + all readout', () => {
  it('resolves Shift+R and wires Face Live reset then bundle flash', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'r', shiftKey: true }).action,
    ).toBe('resetShowBundle');
    expect(resolveDisneyExtremeHotkey({ key: 'r' }).action).toBe(
      'resetDefaults',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'r', altKey: true }).action,
    ).toBe('jumpBaselinePin');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+R reset+all');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeResetBundle');
    expect(src).toContain('function resetDisneyExtremeUiAndShowBundle');
    expect(src).toContain("resolved.action === 'resetShowBundle'");
    expect(src).toContain('resetDisneyExtremeUi()');
    expect(src).toContain('flashDisneyExtremeBundle()');
  });
});
