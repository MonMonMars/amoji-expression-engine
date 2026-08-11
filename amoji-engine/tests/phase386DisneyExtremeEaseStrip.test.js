import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineEaseStripLabel,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 386 Extreme ease strip + F3', () => {
  it('formats ease strip, resolves F3, and wires Face Live', () => {
    expect(formatDisneyExtremeBaselineEaseStripLabel({})).toBe(
      'ease · od ×1.45 (off)',
    );
    expect(
      formatDisneyExtremeBaselineEaseStripLabel({
        enabled: true,
        markerT: 1.2,
      }),
    ).toMatch(/^ease · /);
    expect(typeof engine.formatDisneyExtremeBaselineEaseStripLabel).toBe(
      'function',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'F3' }).action).toBe(
      'showBaselineEaseStrip',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'F3', shiftKey: true }).action,
    ).toBe('copyBaselineEaseStrip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('F3 ease strip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('ease strip · live');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeEaseStrip"');
    expect(src).toContain('function flashDisneyExtremeBaselineEaseStrip');
    expect(src).toContain('function copyDisneyExtremeBaselineEaseStrip');
    expect(src).toContain("resolved.action === 'showBaselineEaseStrip'");
    expect(src).toContain("resolved.action === 'copyBaselineEaseStrip'");
    expect(src).toContain('syncDisneyExtremeEaseStripUi(');
  });
});
