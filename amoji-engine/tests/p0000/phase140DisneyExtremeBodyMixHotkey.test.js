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

describe('Phase 140 Extreme M hotkey flash body mix', () => {
  it('resolves M to showBodyMix and lists it in help', () => {
    expect(matchDisneyExtremeHotkey('M')?.entry.id).toBe('showBodyMix');
    expect(resolveDisneyExtremeHotkey({ key: 'm' }).action).toBe(
      'showBodyMix',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('M mix');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });

  it('Face Live wires showBodyMix to flashDisneyExtremeBodyMix', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("resolved.action === 'showBodyMix'");
    expect(src).toContain('function flashDisneyExtremeBodyMix()');
    expect(src).toContain('<kbd>M</kbd>');
  });
});
