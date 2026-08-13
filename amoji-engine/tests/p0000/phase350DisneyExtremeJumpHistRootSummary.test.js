import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 350 Extreme Space jump hist root summary', () => {
  it('resolves Space and wires Face Live oldest hist jump summary', () => {
    expect(resolveDisneyExtremeHotkey({ key: ' ' }).action).toBe(
      'jumpBaselineHistoryRootSummary',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: ' ', shiftKey: true }).action,
    ).toBe('jumpBaselineRedoRootSummary');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'Space jump hist root summary',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpHistRootSummary');
    expect(src).toContain(
      'function jumpDisneyExtremeBaselineHistoryRootSummary',
    );
    expect(src).toContain(
      "resolved.action === 'jumpBaselineHistoryRootSummary'",
    );
  });
});
