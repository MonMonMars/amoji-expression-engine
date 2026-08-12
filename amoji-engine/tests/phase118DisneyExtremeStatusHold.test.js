import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  shouldHoldDisneyExtremeStatus,
  DISNEY_EXTREME_STATUS_HOLD_MS,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 118 Extreme status flash hold', () => {
  it('holds status until deadline then releases', () => {
    expect(DISNEY_EXTREME_STATUS_HOLD_MS).toBe(2200);
    expect(shouldHoldDisneyExtremeStatus(1000, 500)).toBe(true);
    expect(shouldHoldDisneyExtremeStatus(1000, 1000)).toBe(false);
    expect(shouldHoldDisneyExtremeStatus(null, 1)).toBe(false);
    expect(typeof engine.shouldHoldDisneyExtremeStatus).toBe('function');
    expect(engine.DISNEY_EXTREME_STATUS_HOLD_MS).toBe(2200);
  });

  it('Face Live flashes Copy/Help/Reset and gates live HUD updates', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('function flashDisneyExtremeStatus');
    expect(src).toContain('DISNEY_EXTREME_STATUS_HOLD_MS');
    expect(src).toContain('shouldHoldDisneyExtremeStatus');
    expect(src).toContain("flashDisneyExtremeStatus('reset · × defaults')");
    expect(src).toMatch(
      /copyDisneyExtremeSummary[\s\S]*?formatDisneyExtremeBaselineCopyFlashLabel/,
    );
    expect(src).toContain('flashDisneyExtremeStatus(\n            formatDisneyExtremeHotkeyDigest');
  });
});
