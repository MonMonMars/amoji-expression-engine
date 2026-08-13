import { describe, expect, it } from 'vitest';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 452 Extreme spark label title tooltips', () => {
  it('adds title tooltips to spark/readout labels and strips empty row', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('spark/readout labels · title tooltips');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain(
      'id="disneyExtremeFactorBarsLabel"',
    );
    expect(src).toContain('Live factors label · F flash · ⇧F copy');
    expect(src).toContain(
      'id="disneyExtremeEaseLabel"',
    );
    expect(src).toContain('Live ease label · E flash · ⇧E copy');
    expect(src).toContain(
      'id="disneyExtremeBodyMixLabel"',
    );
    expect(src).toContain('Live mix label · M flash · ⇧M copy');
    expect(src).toContain(
      'id="disneyExtremeStripsEmpty"',
    );
    expect(src).toContain('No strips match · click/Enter/Space clear');
  });
});
