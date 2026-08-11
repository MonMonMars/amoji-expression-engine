import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 347 Extreme Alt+/ jump redo root', () => {
  it('resolves Alt+/ and wires Face Live oldest redo jump', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: '/', altKey: true }).action,
    ).toBe('jumpBaselineRedoRoot');
    expect(resolveDisneyExtremeHotkey({ key: '/' }).action).toBe(
      'jumpBaselineHistoryRoot',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+/ jump redo root');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpRedoRoot');
    expect(src).toContain('function jumpDisneyExtremeBaselineRedoRoot');
    expect(src).toContain("resolved.action === 'jumpBaselineRedoRoot'");
    expect(src).toContain('jumpDisneyExtremeBaselineRedo(0)');
  });
});
