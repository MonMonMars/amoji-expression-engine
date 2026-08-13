import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 272 Extreme Alt+P copy fingerprint', () => {
  it('resolves Alt+P and wires Face Live copy fp', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: 'p', altKey: true }).action,
    ).toBe('copySnapshotFingerprint');
    expect(resolveDisneyExtremeHotkey({ key: 'p' }).action).toBe(
      'pinBaseline',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+P copy fp');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyFp');
    expect(src).toContain('function copyDisneyExtremeSnapshotFingerprint');
    expect(src).toContain("resolved.action === 'copySnapshotFingerprint'");
    expect(src).toMatch(
      /copyDisneyExtremeSnapshotFingerprint[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel[\s\S]*?summary: `fp \$\{fp\}`/,
    );
  });
});
