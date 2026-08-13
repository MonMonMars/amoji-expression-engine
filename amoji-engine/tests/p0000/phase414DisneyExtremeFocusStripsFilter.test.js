import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 414 Extreme F12 focus strips filter', () => {
  it('resolves F12 and wires focus filter', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'F12' }).action).toBe(
      'focusStripsFilter',
    );
    expect(
      resolveDisneyExtremeHotkey({
        key: 'F12',
        target: { tagName: 'INPUT' },
      }).ok,
    ).toBe(false);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('F12 focus filter');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeFocusFilter');
    expect(src).toContain('function focusDisneyExtremeStripsFilter');
    expect(src).toContain("resolved.action === 'focusStripsFilter'");
    expect(src).toContain('filter · focused');
  });
});
