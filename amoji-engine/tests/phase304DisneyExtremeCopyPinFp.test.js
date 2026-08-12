import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 304 Extreme ⇧Alt+P copy pin fingerprint', () => {
  it('resolves ⇧Alt+P and wires Face Live pin fingerprint copy', () => {
    expect(
      resolveDisneyExtremeHotkey({
        key: 'p',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyBaselinePinFingerprint');
    expect(
      resolveDisneyExtremeHotkey({ key: 'p', altKey: true }).action,
    ).toBe('copySnapshotFingerprint');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+P copy pin fp');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyPinFp');
    expect(src).toContain('function copyDisneyExtremeBaselinePinFingerprint');
    expect(src).toContain("resolved.action === 'copyBaselinePinFingerprint'");
    expect(src).toMatch(
      /copyDisneyExtremeBaselinePinFingerprint[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: `pin fp \$\{fp\}`/,
    );
  });
});
