import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 330 Extreme Shift+0 jump fav tip summary', () => {
  it('resolves Shift+0 and wires Face Live fav tip jump+summary', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: '0', shiftKey: true }).action,
    ).toBe('jumpBaselineFavoriteTipSummary');
    expect(resolveDisneyExtremeHotkey({ key: '0' }).action).toBe(
      'jumpBaselineFavoriteTip',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: '0', altKey: true }).action,
    ).toBe('showBaselineTips');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'Shift+0 jump fav tip summary',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpFavTipSummary');
    expect(src).toContain(
      'function jumpDisneyExtremeBaselineFavoriteTipSummary',
    );
    expect(src).toContain(
      "resolved.action === 'jumpBaselineFavoriteTipSummary'",
    );
    expect(src).toContain('jumpDisneyExtremeBaselineFavoriteSummary(n - 1)');
  });
});
