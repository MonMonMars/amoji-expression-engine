import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 220 Extreme Face Live history chips UI', () => {
  it('renders history container and chip sync helpers', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeHistory"');
    expect(src).toContain('function syncDisneyExtremeHistoryUi');
    expect(src).toContain('extreme-hist-chip');
    expect(src).toContain('function jumpDisneyExtremeBaselineHistory');
    expect(src).toContain('formatDisneyExtremeBaselineHistoryEntry');
  });
});
