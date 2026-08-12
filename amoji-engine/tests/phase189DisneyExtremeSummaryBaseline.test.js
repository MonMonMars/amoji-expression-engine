import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  summarizeDisneyExtremePrefs,
  defaultFaceLivePrefs,
} from '../engine/ui/faceLivePrefs.js';
import {
  buildDisneyExtremeLiveSnapshot,
  disneyExtremeSnapshotFingerprintShort,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 189 Extreme summary includes baseline dirty', () => {
  it('appends clean/dirty fp when baseline opts provided', () => {
    const prefs = {
      ...defaultFaceLivePrefs(),
      disneyExtreme: true,
      disneyExtremeFactor: 1.6,
      disneyExtremeBody: true,
      disneyExtremeBodyFactor: 1.6,
      disneyExtremeEyeFactor: 1.4,
      disneyExtremeMouthFactor: 1.5,
      intensity: 0.7,
    };
    const baseline = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.7,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.6,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const fp = disneyExtremeSnapshotFingerprintShort(baseline);
    expect(summarizeDisneyExtremePrefs(prefs, { baseline })).toContain(
      `clean ${fp}`,
    );
    const dirtyPrefs = { ...prefs, disneyExtremeFactor: 1.7 };
    expect(summarizeDisneyExtremePrefs(dirtyPrefs, { baseline })).toContain(
      'dirty ',
    );
    expect(typeof engine.summarizeDisneyExtremePrefs).toBe('function');
  });

  it('Face Live passes baseline into summarize on title + copy', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('baseline: lastExtremeBaselineSnap');
    expect(src).toContain('stripsFilter: disneyExtremeStripsFilterSummaryText()');
    expect(src).toContain('syncDisneyExtremePrefsSummary()');
  });
});
