import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 442 Extreme Insert pin family buttons', () => {
  it('wires Insert/⇧Insert/Alt+Insert/⇧Alt+Insert pin buttons', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'Insert' }).action).toBe(
      'pinBaseline',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'Insert', shiftKey: true }).action,
    ).toBe('replaceBaselinePin');
    expect(
      resolveDisneyExtremeHotkey({ key: 'Insert', altKey: true }).action,
    ).toBe('jumpBaselinePin');
    expect(
      resolveDisneyExtremeHotkey({
        key: 'Insert',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('jumpBaselinePinSummary');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Insert pin · button');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+Insert jump pin summary · button');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="btnDisneyExtremeInsertPin"');
    expect(src).toContain('id="btnDisneyExtremeReplacePinInsert"');
    expect(src).toContain('id="btnDisneyExtremeJumpPinInsert"');
    expect(src).toContain('id="btnDisneyExtremeJumpPinSummaryInsert"');
    expect(src).toContain(
      "getElementById('btnDisneyExtremeInsertPin')?.addEventListener('click'",
    );
    expect(src).toContain('pinDisneyExtremeBaseline();');
    expect(src).toContain('replaceDisneyExtremeBaselinePin();');
    expect(src).toContain('jumpDisneyExtremeBaselinePin();');
    expect(src).toContain('jumpDisneyExtremeBaselinePinSummary();');
  });
});
