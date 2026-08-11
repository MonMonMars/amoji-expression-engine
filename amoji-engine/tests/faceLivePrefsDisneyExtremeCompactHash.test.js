import { describe, expect, it } from 'vitest';
import {
  compactPrefsForHash,
  defaultFaceLivePrefs,
} from '../engine/ui/faceLivePrefs.js';

describe('Face Live Disney Extreme compact hash', () => {
  it('includes disneyExtreme* keys when values differ from defaults', () => {
    const base = defaultFaceLivePrefs();
    const compact = compactPrefsForHash({
      ...base,
      disneyExtreme: true,
      disneyExtremeFactor: base.disneyExtremeFactor + 0.2,
      disneyExtremeBody: false,
      disneyExtremeEyeFactor: base.disneyExtremeEyeFactor + 0.3,
      disneyExtremeMouthFactor: base.disneyExtremeMouthFactor + 0.4,
    });

    expect(compact.disneyExtreme).toBe(true);
    expect(compact.disneyExtremeFactor).toBeGreaterThan(base.disneyExtremeFactor);
    expect(compact.disneyExtremeBody).toBe(false);
    expect(compact.disneyExtremeEyeFactor).toBeGreaterThan(
      base.disneyExtremeEyeFactor,
    );
    expect(compact.disneyExtremeMouthFactor).toBeGreaterThan(
      base.disneyExtremeMouthFactor,
    );
  });
});

