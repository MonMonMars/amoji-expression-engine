import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 311 Extreme Shift+X enable Extreme', () => {
  it('resolves Shift+X and wires Face Live force-enable', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'x', shiftKey: true }).action,
    ).toBe('enableExtreme');
    expect(resolveDisneyExtremeHotkey({ key: 'x' }).action).toBe('toggle');
    expect(
      resolveDisneyExtremeHotkey({ key: 'x', altKey: true }).action,
    ).toBe('focusExtremePanel');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+X enable');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeEnable');
    expect(src).toContain('function enableDisneyExtreme');
    expect(src).toContain("resolved.action === 'enableExtreme'");
    expect(src).toContain('extreme · enabled');
    expect(src).toContain('extreme · already on');
  });
});
