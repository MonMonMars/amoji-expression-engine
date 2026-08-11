import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 351 Extreme Shift+Space jump redo root summary', () => {
  it('resolves Shift+Space and wires Face Live oldest redo jump summary', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: ' ', shiftKey: true }).action,
    ).toBe('jumpBaselineRedoRootSummary');
    expect(resolveDisneyExtremeHotkey({ key: ' ' }).action).toBe(
      'jumpBaselineHistoryRootSummary',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'Shift+Space jump redo root summary',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpRedoRootSummary');
    expect(src).toContain('function jumpDisneyExtremeBaselineRedoRootSummary');
    expect(src).toContain("resolved.action === 'jumpBaselineRedoRootSummary'");
  });
});
