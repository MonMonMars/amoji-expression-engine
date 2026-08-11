import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 312 Extreme Shift+B enable body', () => {
  it('resolves Shift+B and wires Face Live force body apply', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'b', shiftKey: true }).action,
    ).toBe('enableBodyApply');
    expect(resolveDisneyExtremeHotkey({ key: 'b' }).action).toBe(
      'toggleBodyApply',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'b', altKey: true }).action,
    ).toBe('pasteBaselineStacksShareUrl');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+B enable body');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeEnableBody');
    expect(src).toContain('function enableDisneyExtremeBodyApply');
    expect(src).toContain("resolved.action === 'enableBodyApply'");
    expect(src).toContain('body · enabled');
    expect(src).toContain('body · already on');
  });
});
