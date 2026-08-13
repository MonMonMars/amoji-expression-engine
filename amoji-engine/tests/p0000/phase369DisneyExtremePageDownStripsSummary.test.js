import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 369 Extreme PageDown strips summary', () => {
  it('resolves PageDown and wires strips summary flash', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'PageDown' }).action).toBe(
      'showBaselineStripsSummary',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'PageUp' }).action).toBe(
      'toggleBaselineStrips',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('PageDown strips summary');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeStripsSummary');
    expect(src).toContain('function flashDisneyExtremeBaselineStripsSummary');
    expect(src).toContain("resolved.action === 'showBaselineStripsSummary'");
    expect(src).toContain('formatDisneyExtremeBaselineStripsSummaryLabel(');
  });
});
