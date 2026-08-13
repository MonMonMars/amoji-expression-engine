import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 346 Extreme / jump hist root', () => {
  it('resolves / and wires Face Live oldest history jump', () => {
    expect(resolveDisneyExtremeHotkey({ key: '/' }).action).toBe(
      'jumpBaselineHistoryRoot',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: '/', altKey: true }).action,
    ).toBe('jumpBaselineRedoRoot');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('/ jump hist root');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeJumpHistRoot');
    expect(src).toContain('function jumpDisneyExtremeBaselineHistoryRoot');
    expect(src).toContain("resolved.action === 'jumpBaselineHistoryRoot'");
    expect(src).toContain('jumpDisneyExtremeBaselineHistory(0)');
  });
});
