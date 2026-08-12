import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 448 Extreme toolbar button titles', () => {
  it('gives main-toolbar buttons title tooltips with hotkeys', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    const start = src.indexOf('id="btnDisneyExtremeReset"');
    const end = src.indexOf('<details id="disneyExtremeMore">');
    const block = src.slice(start, end);
    const buttons = [...block.matchAll(/id="(btnDisneyExtreme[^"]+)"[^>]*>/g)];
    expect(buttons.length).toBeGreaterThan(80);
    for (const m of buttons) {
      const idx = block.indexOf(m[0]);
      const tag = block.slice(Math.max(0, idx - 80), idx + m[0].length + 20);
      expect(tag, m[1]).toContain('title="');
    }
    expect(block).toContain('title="Reset × defaults · R"');
    expect(block).toContain('title="Dirty strip · Home"');
    expect(block).toContain('title="Strips summary · PageDown"');
    expect(block).toContain('title="Copy prefs summary · filter-aware when filter active"');
  });
});
