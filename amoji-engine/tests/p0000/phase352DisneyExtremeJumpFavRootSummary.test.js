import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 352 Extreme Alt+Space jump fav root summary', () => {
  it('resolves Alt+Space and wires Face Live oldest fav jump summary', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: ' ', altKey: true }).action,
    ).toBe('jumpBaselineFavoriteRootSummary');
    expect(
      resolveDisneyExtremeHotkey({
        key: ' ',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('showBaselineActive');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'Alt+Space jump fav root summary',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpFavRootSummary');
    expect(src).toContain(
      'function jumpDisneyExtremeBaselineFavoriteRootSummary',
    );
    expect(src).toContain(
      "resolved.action === 'jumpBaselineFavoriteRootSummary'",
    );
  });
});
