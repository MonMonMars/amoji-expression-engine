import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineNeckStripLabel,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 388 Extreme neck strip + F5', () => {
  it('formats neck strip, resolves F5, and wires Face Live', () => {
    expect(formatDisneyExtremeBaselineNeckStripLabel({})).toBe(
      'neck · 0.75 · body mix (off)',
    );
    expect(
      formatDisneyExtremeBaselineNeckStripLabel({
        enabled: true,
        bodyOn: true,
        neckBlend: 0.75,
        bodyMix: 1.2,
        bodyInt: 1.1,
      }),
    ).toMatch(/^neck · /);
    expect(typeof engine.formatDisneyExtremeBaselineNeckStripLabel).toBe(
      'function',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'F5' }).action).toBe(
      'showBaselineNeckStrip',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'F5', shiftKey: true }).action,
    ).toBe('copyBaselineNeckStrip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('F5 neck strip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('neck strip · live');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeNeckStrip"');
    expect(src).toContain('function flashDisneyExtremeBaselineNeckStrip');
    expect(src).toContain('function copyDisneyExtremeBaselineNeckStrip');
    expect(src).toContain("resolved.action === 'showBaselineNeckStrip'");
    expect(src).toContain("resolved.action === 'copyBaselineNeckStrip'");
    expect(src).toContain('syncDisneyExtremeNeckStripUi(');
  });
});
