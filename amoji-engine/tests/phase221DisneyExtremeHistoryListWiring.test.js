import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 221 Extreme Face Live history list wiring', () => {
  it('wires L hotkey, button, and sync on undo/redo/clear', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeHistList');
    expect(src).toContain('function flashDisneyExtremeBaselineHistoryList');
    expect(src).toContain("resolved.action === 'showBaselineHistory'");
    expect(src).toContain('syncDisneyExtremeHistoryUi()');
    expect(src).toContain('hist · jump #');
  });
});
