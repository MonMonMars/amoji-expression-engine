import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 292 Extreme Shift+Alt+B merge stacks share', () => {
  it('resolves Shift+Alt+B and wires Face Live merge stacks share', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'b',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('mergeBaselineStacksShareUrl');
    expect(
      resolveDisneyExtremeHotkey({ key: 'b', altKey: true }).action,
    ).toBe('pasteBaselineStacksShareUrl');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+B merge stacks');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeMergeStacksShare');
    expect(src).toContain(
      "resolved.action === 'mergeBaselineStacksShareUrl'",
    );
    expect(src).toContain(
      'pasteDisneyExtremeBaselineStacksShareUrl({ merge: true })',
    );
  });
});
