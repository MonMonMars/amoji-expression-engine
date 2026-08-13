import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 273 Extreme active hist/redo chip highlight', () => {
  it('marks active hist/redo chips from jump indices', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('hist/redo chip · active');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('extreme-hist-chip.is-active');
    expect(src).toContain('extremeHistoryJumpIndexActive === i');
    expect(src).toContain('extremeRedoJumpIndexActive === i');
    expect(src).toContain('let extremeHistoryJumpIndexActive = null');
    expect(src).toContain('let extremeRedoJumpIndexActive = null');
    expect(src).toContain('extremeHistoryJumpIndexActive = index');
    expect(src).toContain('extremeRedoJumpIndexActive = index');
  });
});
