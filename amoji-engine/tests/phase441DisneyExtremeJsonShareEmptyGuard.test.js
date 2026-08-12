import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 441 Extreme JSON/share empty guards', () => {
  it('skips clipboard when JSON/share payloads are empty', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('JSON copy · empty guard');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toMatch(
      /copyDisneyExtremeBaselineFavoritesJson[\s\S]*?const empty = count === 0/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselineHistoryJson[\s\S]*?const empty = count === 0/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselineStacksJson[\s\S]*?histN === 0 && redoN === 0 && favN === 0/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeBaselineHistoryShareUrl[\s\S]*?const empty = count === 0/,
    );
    expect(src).toMatch(
      /copyDisneyExtremeSnapshotDiff[\s\S]*?const empty = !String\(text/,
    );
  });
});
