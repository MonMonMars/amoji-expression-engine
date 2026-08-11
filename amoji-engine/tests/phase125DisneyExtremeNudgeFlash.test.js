import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  formatDisneyExtremeNudgeFlash,
  DISNEY_EXTREME_NUDGE_FLASH_MS,
} from '../engine/ui/faceLivePrefs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 125 Extreme nudge factor flash', () => {
  it('formats short nudge flash copy', () => {
    expect(DISNEY_EXTREME_NUDGE_FLASH_MS).toBe(700);
    expect(formatDisneyExtremeNudgeFlash('nudgeShapeUp', 1.65)).toBe(
      'shape × 1.65',
    );
    expect(formatDisneyExtremeNudgeFlash('nudgeBodyDown', 1.5)).toBe(
      'body × 1.50',
    );
    expect(formatDisneyExtremeNudgeFlash('nudgeEyeUp', 1.4)).toBe('eye × 1.40');
    expect(formatDisneyExtremeNudgeFlash('nudgeMouthDown', 1.55)).toBe(
      'mouth × 1.55',
    );
    expect(typeof engine.formatDisneyExtremeNudgeFlash).toBe('function');
  });

  it('Face Live flashes nudge values with the short hold', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('formatDisneyExtremeNudgeFlash');
    expect(src).toContain('DISNEY_EXTREME_NUDGE_FLASH_MS');
    expect(src).toContain(
      'formatDisneyExtremeNudgeFlash(resolved.action, nextVal, {\n              delta: resolved.delta,\n            })',
    );
  });
});
