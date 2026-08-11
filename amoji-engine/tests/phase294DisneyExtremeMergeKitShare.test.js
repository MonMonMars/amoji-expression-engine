import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 294 Extreme Shift+Alt+V merge kit share', () => {
  it('resolves Shift+Alt+V and wires Face Live merge kit', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'v',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('mergeBaselineKitShareUrl');
    expect(
      resolveDisneyExtremeHotkey({ key: 'v', altKey: true }).action,
    ).toBe('pasteBaselineKitShareUrl');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+V merge kit');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeMergeKit');
    expect(src).toContain("resolved.action === 'mergeBaselineKitShareUrl'");
    expect(src).toContain(
      'pasteDisneyExtremeBaselineKitShareUrl({ merge: true })',
    );
  });
});
