import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  serializeDisneyExtremeSnapshot,
  parseDisneyExtremeSnapshot,
  DISNEY_EXTREME_SNAPSHOT_JSON_KIND,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 166 Extreme parse snapshot JSON', () => {
  it('round-trips serialize → parse and rejects bad kind', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.9,
      shapeFactor: 1.7,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const raw = serializeDisneyExtremeSnapshot(snap);
    const parsed = parseDisneyExtremeSnapshot(raw);
    expect(parsed.ok).toBe(true);
    expect(parsed.snap.enabled).toBe(true);
    expect(parsed.snap.shapeFactor).toBeCloseTo(1.7);
    expect(parsed.snap.bodyOn).toBe(true);
    expect(parsed.snap.ease).toBeCloseTo(snap.ease);
    expect(parseDisneyExtremeSnapshot('').ok).toBe(false);
    expect(parseDisneyExtremeSnapshot('{').error).toBe('invalid_json');
    expect(
      parseDisneyExtremeSnapshot(
        JSON.stringify({ kind: 'nope', enabled: true }),
      ).error,
    ).toBe('kind');
    expect(parseDisneyExtremeSnapshot({ kind: DISNEY_EXTREME_SNAPSHOT_JSON_KIND, enabled: false }).ok).toBe(
      true,
    );
    expect(typeof engine.parseDisneyExtremeSnapshot).toBe('function');
  });
});
