import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 262 Extreme Alt+Z merge stacks', () => {
  it('resolves Alt+Z merge and wires Face Live', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'z', altKey: true }).action,
    ).toBe('mergeBaselineStacksJson');
    expect(
      resolveDisneyExtremeHotkey({ key: 'z', shiftKey: true }).action,
    ).toBe('pasteBaselineStacksJson');
    expect(resolveDisneyExtremeHotkey({ key: 'z' }).action).toBe(
      'copyBaselineStacksJson',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+Z merge stacks');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeMergeStacks');
    expect(src).toContain("resolved.action === 'mergeBaselineStacksJson'");
    expect(src).toContain("pasteDisneyExtremeBaselineStacksJson({ merge: true })");
  });
});
