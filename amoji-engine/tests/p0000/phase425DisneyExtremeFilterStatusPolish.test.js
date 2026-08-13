import { describe, expect, it } from 'vitest';
import { summarizeDisneyExtremePrefs } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 425 Extreme filter status polish', () => {
  it('appends filter to status title and documents copy-all-open', () => {
    const title = summarizeDisneyExtremePrefs(
      {
        disneyExtreme: true,
        disneyExtremeFactor: 1.6,
        disneyExtremeBody: true,
        disneyExtremeBodyFactor: 1.6,
        disneyExtremeEyeFactor: 1.4,
        disneyExtremeMouthFactor: 1.5,
        intensity: 0.5,
      },
      { stripsFilter: 'filter · "pin" · 1/11' },
    );
    expect(title).toContain('filter · "pin" · 1/11');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function disneyExtremePrefsSummaryOpts');
    expect(src).toContain('stripsFilter: disneyExtremeStripsFilterSummaryText()');
    expect(src).toContain('filtered bundle when filter active');
    expect(src).toContain('filter-aware when filter active');
  });
});
