import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  serializeDisneyExtremeSnapshot,
  DISNEY_EXTREME_SNAPSHOT_JSON_KIND,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 164 Extreme snapshot JSON serialize', () => {
  it('emits versioned JSON payload', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 1.0,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const raw = serializeDisneyExtremeSnapshot(snap);
    const parsed = JSON.parse(raw);
    expect(parsed.kind).toBe(DISNEY_EXTREME_SNAPSHOT_JSON_KIND);
    expect(parsed.enabled).toBe(true);
    expect(parsed.shapeInt).toBeCloseTo(snap.shapeInt);
    expect(parsed.ease).toBeCloseTo(snap.ease);
    expect(parsed.bodyMix).toBeCloseTo(snap.bodyMix);
    const pretty = serializeDisneyExtremeSnapshot(snap, { pretty: true });
    expect(pretty).toContain('\n');
    expect(engine.DISNEY_EXTREME_SNAPSHOT_JSON_KIND).toBe(
      DISNEY_EXTREME_SNAPSHOT_JSON_KIND,
    );
    expect(typeof engine.serializeDisneyExtremeSnapshot).toBe('function');
  });
});
