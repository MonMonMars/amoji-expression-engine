import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  matchDisneyExtremeHotkey,
} from '../engine/layers/emotionMorphs.js';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 133 Extreme E hotkey flash ease curve', () => {
  it('resolves E to showEaseCurve and lists it in help', () => {
    expect(matchDisneyExtremeHotkey('E')?.entry.id).toBe('showEaseCurve');
    expect(resolveDisneyExtremeHotkey({ key: 'e' }).action).toBe(
      'showEaseCurve',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('E ease');
    expect(typeof engine.resolveDisneyExtremeHotkey).toBe('function');
  });

  it('Face Live wires showEaseCurve to flashDisneyExtremeEaseCurve', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain("resolved.action === 'showEaseCurve'");
    expect(src).toContain('flashDisneyExtremeEaseCurve()');
    expect(src).toContain('<kbd>E</kbd>');
  });
});
