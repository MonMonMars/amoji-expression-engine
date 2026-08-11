import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 290 Extreme Shift+Alt+F merge fav share', () => {
  it('resolves Shift+Alt+F and wires Face Live merge fav share', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'f',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('mergeBaselineFavoritesShareUrl');
    expect(
      resolveDisneyExtremeHotkey({ key: 'f', altKey: true }).action,
    ).toBe('pasteBaselineFavoritesShareUrl');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+F merge fav');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeMergeFavShare');
    expect(src).toContain(
      "resolved.action === 'mergeBaselineFavoritesShareUrl'",
    );
    expect(src).toContain(
      'pasteDisneyExtremeBaselineFavoritesShareUrl({ merge: true })',
    );
  });
});
