import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  formatDisneyExtremeBaselineStacksBundle,
  buildDisneyExtremeLiveSnapshot,
} from '../engine/layers/emotionMorphs.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 325 Extreme ⇧Alt+Z copy stacks+json', () => {
  it('resolves ⇧Alt+Z and wires Face Live stacks summary+JSON bundle copy', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.6,
      shapeFactor: 1.3,
    });
    const text = formatDisneyExtremeBaselineStacksBundle({
      history: [snap],
      redo: [],
      favorites: [],
    });
    expect(text.startsWith('stacks · hist 1')).toBe(true);
    expect(text).toContain('"kind"');
    expect(
      resolveDisneyExtremeHotkey({
        key: 'z',
        altKey: true,
        shiftKey: true,
      }).action,
    ).toBe('copyBaselineStacksBundle');
    expect(
      resolveDisneyExtremeHotkey({ key: 'z', altKey: true }).action,
    ).toBe('mergeBaselineStacksJson');
    expect(
      resolveDisneyExtremeHotkey({ key: 'z', shiftKey: true }).action,
    ).toBe('pasteBaselineStacksJson');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('⇧Alt+Z copy stacks+json');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyStacksBundle');
    expect(src).toContain('function copyDisneyExtremeBaselineStacksBundle');
    expect(src).toContain("resolved.action === 'copyBaselineStacksBundle'");
    expect(src).toContain('formatDisneyExtremeBaselineStacksBundle(');
  });
});
