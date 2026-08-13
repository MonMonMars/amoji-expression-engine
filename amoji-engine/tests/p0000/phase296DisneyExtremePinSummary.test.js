import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 296 Extreme Alt+D pin summary', () => {
  it('resolves Alt+D and wires Face Live pin summary flash', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'd', altKey: true }).action,
    ).toBe('showBaselinePin');
    expect(resolveDisneyExtremeHotkey({ key: 'd' }).action).toBe(
      'showSnapshotDiff',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'd', shiftKey: true }).action,
    ).toBe('restoreBaseline');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+D pin summary');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremePinSummary');
    expect(src).toContain('function flashDisneyExtremeBaselinePinSummary');
    expect(src).toContain("resolved.action === 'showBaselinePin'");
    expect(src).toContain('pin · none');
  });
});
