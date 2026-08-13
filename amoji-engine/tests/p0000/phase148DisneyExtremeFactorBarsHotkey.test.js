import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveDisneyExtremeHotkey } from '../../engine/ui/faceLivePrefs.js';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

describe('Phase 148 Extreme F hotkey flash factor bars', () => {
  it('resolves F to showFactorBars and lists it in help', () => {
    expect(matchDisneyExtremeHotkey('F')?.entry.id).toBe('showFactorBars');
    expect(resolveDisneyExtremeHotkey({ key: 'f' }).action).toBe(
      'showFactorBars',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('F factors');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });

  it('Face Live wires showFactorBars to flashDisneyExtremeFactorBars', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("resolved.action === 'showFactorBars'");
    expect(src).toContain('function flashDisneyExtremeFactorBars()');
    expect(src).toContain('<kbd>F</kbd>');
  });
});
