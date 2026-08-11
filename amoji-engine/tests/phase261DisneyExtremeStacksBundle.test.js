import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  DISNEY_EXTREME_BASELINE_STACKS_JSON_KIND,
  buildDisneyExtremeLiveSnapshot,
  serializeDisneyExtremeBaselineStacks,
  parseDisneyExtremeBaselineStacks,
  formatDisneyExtremeBaselineStacksPreviewLabel,
  matchDisneyExtremeHotkey,
  disneyExtremeSnapshotFingerprint,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 261 Extreme Z / Shift+Z stacks JSON bundle', () => {
  it('round-trips stacks JSON, resolves hotkeys, and wires Face Live', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const raw = serializeDisneyExtremeBaselineStacks(
      { history: [snap], redo: [snap], favorites: [snap] },
      { pretty: true },
    );
    expect(JSON.parse(raw).kind).toBe(DISNEY_EXTREME_BASELINE_STACKS_JSON_KIND);
    const parsed = parseDisneyExtremeBaselineStacks(raw);
    expect(parsed.ok).toBe(true);
    expect(parsed.history).toHaveLength(1);
    expect(parsed.redo).toHaveLength(1);
    expect(parsed.favorites).toHaveLength(1);
    expect(disneyExtremeSnapshotFingerprint(parsed.history[0])).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    expect(formatDisneyExtremeBaselineStacksPreviewLabel(parsed)).toBe(
      'preview · stacks · hist 1 · redo 1 · fav 1',
    );
    expect(formatDisneyExtremeBaselineStacksPreviewLabel({})).toBe(
      'preview · stacks · empty',
    );
    expect(matchDisneyExtremeHotkey('Z')?.entry.id).toBe(
      'copyBaselineStacksJson',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'z' }).action).toBe(
      'copyBaselineStacksJson',
    );
    expect(
      resolveDisneyExtremeHotkey({ key: 'z', shiftKey: true }).action,
    ).toBe('pasteBaselineStacksJson');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Z copy stacks');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift+Z paste stacks');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('btnDisneyExtremeCopyStacks');
    expect(src).toContain('btnDisneyExtremePasteStacks');
    expect(src).toContain('function copyDisneyExtremeBaselineStacksJson');
    expect(src).toContain('function pasteDisneyExtremeBaselineStacksJson');
    expect(src).toContain('function applyDisneyExtremeBaselineStacks');
    expect(src).toContain('parseDisneyExtremeBaselineStacks');
    expect(src).toContain("resolved.action === 'copyBaselineStacksJson'");
    expect(src).toContain("resolved.action === 'pasteBaselineStacksJson'");
    expect(src).toContain('keepRedo: true');
    expect(typeof engine.serializeDisneyExtremeBaselineStacks).toBe(
      'function',
    );
  });
});
