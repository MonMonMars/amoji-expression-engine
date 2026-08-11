import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 291 Extreme Shift+Alt+I merge hist share', () => {
  it('resolves Shift+Alt+I and wires Face Live merge hist share', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'i',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('mergeBaselineHistoryShareUrl');
    expect(
      resolveDisneyExtremeHotkey({ key: 'i', altKey: true }).action,
    ).toBe('pasteBaselineHistoryShareUrl');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+I merge hist share');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeMergeHistShare');
    expect(src).toContain(
      "resolved.action === 'mergeBaselineHistoryShareUrl'",
    );
    expect(src).toContain(
      'pasteDisneyExtremeBaselineHistoryShareUrl({ merge: true })',
    );
  });
});
