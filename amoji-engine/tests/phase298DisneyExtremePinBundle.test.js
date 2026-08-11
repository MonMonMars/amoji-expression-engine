import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 298 Extreme Alt+A pin bundle', () => {
  it('resolves Alt+A and wires Face Live pin bundle flash', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'a', altKey: true }).action,
    ).toBe('showBaselinePinBundle');
    expect(resolveDisneyExtremeHotkey({ key: 'a' }).action).toBe('showBundle');
    expect(
      resolveDisneyExtremeHotkey({ key: 'a', shiftKey: true }).action,
    ).toBe('copyBundle');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+A pin bundle');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremePinBundle');
    expect(src).toContain('function flashDisneyExtremeBaselinePinBundle');
    expect(src).toContain("resolved.action === 'showBaselinePinBundle'");
    expect(src).toContain(
      'formatDisneyExtremeBundleLabel(lastExtremeBaselineSnap)',
    );
  });
});
