import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeStripsFilterCopyText,
} from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 415 Extreme Shift+F12 copy filter', () => {
  it('formats copy text and wires Shift+F12', () => {
    expect(
      formatDisneyExtremeStripsFilterCopyText({ total: 11 }),
    ).toBe('filter · all · 11');
    expect(
      formatDisneyExtremeStripsFilterCopyText({
        query: 'pin',
        visible: 1,
        total: 11,
        visibleIds: ['pin'],
      }),
    ).toBe('filter · "pin" · 1/11 · pin');
    expect(
      formatDisneyExtremeStripsFilterCopyText({
        query: 'zzz',
        visible: 0,
        total: 11,
      }),
    ).toBe('filter · "zzz" · none');
    expect(
      resolveDisneyExtremeHotkey({ key: 'F12', shiftKey: true }).action,
    ).toBe('copyStripsFilterSummary');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+F12 copy filter');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyFilter');
    expect(src).toContain('function copyDisneyExtremeStripsFilterSummary');
    expect(src).toContain("resolved.action === 'copyStripsFilterSummary'");
    expect(src).toContain('formatDisneyExtremeStripsFilterCopyText');
  });
});
