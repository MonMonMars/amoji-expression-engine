import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 470 Extreme panel background keyboard interactions', () => {
  it('adds background click/dblclick and Enter/Shift+Enter actions', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Extreme panel · background click flash');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Extreme panel · ⇧Enter paste');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremePanel"');
    expect(src).toContain('title="Drop Extreme snapshot');
    expect(src).toContain('bindDisneyExtremeFlashCopySurface(disneyExtremePanel');
    expect(src).toContain('backgroundOnly: true');
    expect(src).toContain('pasteOnDblClick: true');
    expect(src).toContain('() => flashDisneyExtremeDropHint()');
    expect(src).toContain('() => pasteDisneyExtremeSnapshotJson()');
  });
});
