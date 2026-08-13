import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 453 Extreme X/B toggle buttons', () => {
  it('wires X/B toggle buttons and keeps hotkey resolution', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'x' }).action).toBe('toggle');
    expect(resolveDisneyExtremeHotkey({ key: 'b' }).action).toBe('toggleBodyApply');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('X toggle · button');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('B body toggle · button');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('id="btnDisneyExtremeToggle"');
    expect(src).toContain('id="btnDisneyExtremeToggleBody"');
    expect(src).toContain('function toggleDisneyExtreme');
    expect(src).toContain('function toggleDisneyExtremeBodyApply');
    expect(src).toContain(
      "getElementById('btnDisneyExtremeToggle')?.addEventListener('click'",
    );
    expect(src).toContain("resolved.action === 'toggle'");
    expect(src).toContain('toggleDisneyExtreme();');
    expect(src).toContain('toggleDisneyExtremeBodyApply();');
  });
});
