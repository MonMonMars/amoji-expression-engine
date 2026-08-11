import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 307 Extreme Shift+P replace pin', () => {
  it('resolves Shift+P and wires Face Live quiet pin replace', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'p', shiftKey: true }).action,
    ).toBe('replaceBaselinePin');
    expect(resolveDisneyExtremeHotkey({ key: 'p' }).action).toBe('pinBaseline');
    expect(
      resolveDisneyExtremeHotkey({ key: 'p', altKey: true }).action,
    ).toBe('copySnapshotFingerprint');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+P replace pin');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeReplacePin');
    expect(src).toContain('function replaceDisneyExtremeBaselinePin');
    expect(src).toContain("resolved.action === 'replaceBaselinePin'");
    expect(src).toContain('pinned · replace · fp');
    expect(src).toContain(
      'lastExtremeBaselineSnap = saveDisneyExtremeBaseline(snap).snap',
    );
  });
});
