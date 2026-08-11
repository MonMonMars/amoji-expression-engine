import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 329 Extreme 0 jump fav tip', () => {
  it('resolves 0 and wires Face Live jump to latest favorite', () => {
    expect(matchDisneyExtremeHotkey('0')?.entry.id).toBe(
      'jumpBaselineFavoriteTip',
    );
    expect(resolveDisneyExtremeHotkey({ key: '0' }).action).toBe(
      'jumpBaselineFavoriteTip',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: '0', shiftKey: true }).ok,
    ).toBe(false);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('0 jump fav tip');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpFavTip');
    expect(src).toContain('function jumpDisneyExtremeBaselineFavoriteTip');
    expect(src).toContain("resolved.action === 'jumpBaselineFavoriteTip'");
    expect(src).toContain('jumpDisneyExtremeBaselineFavorite(n - 1)');
  });
});
