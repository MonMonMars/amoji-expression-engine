import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 295 Extreme Shift+Alt+O merge redo share', () => {
  it('resolves Shift+Alt+O and wires Face Live merge redo share', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'o',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('mergeBaselineRedoShareUrl');
    expect(
      resolveDisneyExtremeHotkey({ key: 'o', altKey: true }).action,
    ).toBe('mergeBaselineRedoJson');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+O merge redo share');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeMergeRedoShare');
    expect(src).toContain("resolved.action === 'mergeBaselineRedoShareUrl'");
    expect(src).toContain(
      'pasteDisneyExtremeBaselineRedoShareUrl({ merge: true })',
    );
  });
});
