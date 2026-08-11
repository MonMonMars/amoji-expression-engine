import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 156 Extreme A hotkey flash bundle', () => {
  it('resolves A to showBundle and lists it in help', () => {
    expect(matchDisneyExtremeHotkey('A')?.entry.id).toBe('showBundle');
    expect(resolveDisneyExtremeHotkey({ key: 'a' }).action).toBe('showBundle');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('A all');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });

  it('Face Live wires showBundle + All readout button', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("resolved.action === 'showBundle'");
    expect(src).toContain('function flashDisneyExtremeBundle()');
    expect(src).toContain('id="btnDisneyExtremeBundle"');
    expect(src).toContain('formatDisneyExtremeBundleLabel');
    expect(src).toContain('<kbd>A</kbd>');
  });
});
