import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 297 Extreme Alt+X focus Extreme panel', () => {
  it('resolves Alt+X and wires Face Live panel focus', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'x', altKey: true }).action,
    ).toBe('focusExtremePanel');
    expect(resolveDisneyExtremeHotkey({ key: 'x' }).action).toBe('toggle');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+X focus panel');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeFocusPanel');
    expect(src).toContain('function focusDisneyExtremePanel');
    expect(src).toContain("resolved.action === 'focusExtremePanel'");
    expect(src).toContain("scrollIntoView({ behavior: 'smooth'");
    expect(src).toContain('panel · focused');
  });
});
