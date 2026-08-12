import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 449 Extreme More IO button titles + copy-flash audit', () => {
  it('covers all Extreme buttons with title tooltips', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    const buttons = [...src.matchAll(/<button[^>]*id="(btnDisneyExtreme[^"]+)"[^>]*>/g)];
    expect(buttons.length).toBe(183);
    for (const m of buttons) {
      expect(m[0], m[1]).toContain('title="');
    }
    const moreStart = src.indexOf('id="btnDisneyExtremeCopyEase"');
    const moreEnd = src.indexOf('id="disneyExtremeHistory"');
    const more = src.slice(moreStart, moreEnd);
    expect(more).toContain('title="Copy ease SVG · ⇧E"');
    expect(more).toContain('title="Open More IO · ⇧Alt+T"');
    expect(src).not.toMatch(/copyDisneyExtreme[\s\S]{0,400}ok \? `copied ·/);
    expect(src).toContain('formatDisneyExtremeBaselineCopyFlashLabel');
  });
});
