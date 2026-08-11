import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselinePinStripLabel,
  buildDisneyExtremeLiveSnapshot,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 356 Extreme pin strip HUD', () => {
  it('formats pin strip label and wires live pin strip', () => {
    expect(formatDisneyExtremeBaselinePinStripLabel(null)).toBe('pin · none');
    expect(formatDisneyExtremeBaselinePinStripLabel(undefined)).toBe(
      'pin · none',
    );
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.6,
      shapeFactor: 1.3,
    });
    const label = formatDisneyExtremeBaselinePinStripLabel(snap);
    expect(label.startsWith('pin ·')).toBe(true);
    expect(label).not.toBe('pin · none');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('pin strip · live');
    expect(typeof engine.formatDisneyExtremeBaselinePinStripLabel).toBe(
      'function',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="disneyExtremePin"');
    expect(src).toContain('function syncDisneyExtremePinUi');
    expect(src).toContain('syncDisneyExtremePinUi()');
    expect(src).toContain('formatDisneyExtremeBaselinePinStripLabel(');
    expect(
      resolveDisneyExtremeHotkey({ key: 'Enter', shiftKey: true }).action,
    ).toBe('showBaselinePinStrip');
  });
});
