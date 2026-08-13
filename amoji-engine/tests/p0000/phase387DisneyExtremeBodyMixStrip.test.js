import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineMixStripLabel,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 387 Extreme mix strip + F4', () => {
  it('formats mix strip, resolves F4, and wires Face Live', () => {
    expect(formatDisneyExtremeBaselineMixStripLabel({})).toBe(
      'mix · cap 1.50 · neck 0.75 (off)',
    );
    expect(
      formatDisneyExtremeBaselineMixStripLabel({
        enabled: true,
        bodyOn: true,
        markerT: 1,
      }),
    ).toMatch(/^mix · /);
    expect(typeof engine.formatDisneyExtremeBaselineMixStripLabel).toBe(
      'function',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'F4' }).action).toBe(
      'showBaselineMixStrip',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'F4', shiftKey: true }).action,
    ).toBe('copyBaselineMixStrip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('F4 mix strip');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('mix strip · live');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremeMixStrip"');
    expect(src).toContain('function flashDisneyExtremeBaselineMixStrip');
    expect(src).toContain('function copyDisneyExtremeBaselineMixStrip');
    expect(src).toContain("resolved.action === 'showBaselineMixStrip'");
    expect(src).toContain("resolved.action === 'copyBaselineMixStrip'");
    expect(src).toContain('syncDisneyExtremeMixStripUi(');
  });
});
