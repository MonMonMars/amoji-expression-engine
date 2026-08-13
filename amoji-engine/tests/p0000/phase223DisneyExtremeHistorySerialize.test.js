import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  pushDisneyExtremeBaselineHistory,
  serializeDisneyExtremeBaselineHistory,
  loadDisneyExtremeBaselineHistory,
  DISNEY_EXTREME_BASELINE_HISTORY_JSON_KIND,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 223 Extreme baseline history JSON serialize', () => {
  it('emits versioned history JSON that load can parse', () => {
    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const b = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.9,
      shapeFactor: 1.7,
      bodyOn: false,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const hist = pushDisneyExtremeBaselineHistory(
      pushDisneyExtremeBaselineHistory([], a),
      b,
    );
    const raw = serializeDisneyExtremeBaselineHistory(hist, { pretty: true });
    const parsed = JSON.parse(raw);
    expect(parsed.kind).toBe(DISNEY_EXTREME_BASELINE_HISTORY_JSON_KIND);
    expect(parsed.items).toHaveLength(2);
    expect(raw).toContain('\n');
    const storage = {
      map: new Map(),
      getItem(k) {
        return this.map.has(k) ? this.map.get(k) : null;
      },
      setItem(k, v) {
        this.map.set(k, String(v));
      },
      removeItem(k) {
        this.map.delete(k);
      },
    };
    storage.setItem('amoji.disneyExtreme.baselineHistory.v1', raw);
    expect(loadDisneyExtremeBaselineHistory({ storage })).toHaveLength(2);
    expect(typeof engine.serializeDisneyExtremeBaselineHistory).toBe(
      'function',
    );
  });
});
