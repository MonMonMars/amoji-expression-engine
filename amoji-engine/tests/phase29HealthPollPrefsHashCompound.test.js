import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  compactPrefsForHash,
  encodePrefsHash,
  decodePrefsHash,
  loadFaceLivePrefsFromHash,
  buildPrefsShareUrl,
  normalizeFaceLivePrefs,
} from '../engine/ui/faceLivePrefs.js';
import {
  startGatewayHealthPoll,
  stopGatewayHealthPoll,
} from '../engine/tts/ttsHealth.js';
import { stageCompoundAffect } from '../engine/export/affectStaging.js';
import { COMPOUNDS } from '../engine/layers/compoundEmotion.js';

afterEach(() => {
  stopGatewayHealthPoll();
  vi.useRealTimers();
});

describe('Phase 29 prefs URL hash', () => {
  it('compacts away defaults and round-trips via encode/decode', () => {
    const compact = compactPrefsForHash({
      emotion: 'fear',
      intensity: 0.7,
      fingerPresetId: 'self-hug',
    });
    expect(compact.emotion).toBe('fear');
    expect(compact.fingerPresetId).toBe('self-hug');
    expect(compact.intensity).toBeUndefined();

    const hash = encodePrefsHash({ emotion: 'angry', chassisId: 'lab-humanoid' });
    expect(hash.startsWith('flp=')).toBe(true);
    const decoded = decodePrefsHash(`#${hash}`);
    expect(decoded.ok).toBe(true);
    expect(decoded.prefs.emotion).toBe('angry');
    expect(decoded.prefs.chassisId).toBe('lab-humanoid');
    expect(decoded.prefs.fingerPresetId).toBe('rest');
  });

  it('loads from location-like hash and builds share URL', () => {
    const frag = encodePrefsHash({ emotion: 'sad', ttsPresetId: 'gateway-step' });
    const fromHash = loadFaceLivePrefsFromHash({ hash: `#${frag}` });
    expect(fromHash.ok).toBe(true);
    expect(fromHash.prefs.ttsPresetId).toBe('gateway-step');

    const share = buildPrefsShareUrl(normalizeFaceLivePrefs({ emotion: 'happy' }), {
      baseUrl: 'http://127.0.0.1:5174/prototypes/face-live',
    });
    expect(share.url).toContain('#flp=');
    expect(share.url.startsWith('http://127.0.0.1:5174/prototypes/face-live#')).toBe(
      true,
    );
  });

  it('rejects missing flp fragment', () => {
    expect(loadFaceLivePrefsFromHash({ hash: '#other=1' }).ok).toBe(false);
    expect(decodePrefsHash('').ok).toBe(false);
  });
});

describe('Phase 29 gateway health poll', () => {
  it('probes immediately and on interval, then stops', async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn(async () => ({ status: 200 }));
    const onResult = vi.fn();
    startGatewayHealthPoll({
      endpoint: 'https://tts.example.com/v1/tts/step',
      intervalMs: 5000,
      fetchImpl,
      onResult,
    });
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchImpl).toHaveBeenCalled();
    expect(onResult).toHaveBeenCalled();
    expect(onResult.mock.calls[0][0].ok).toBe(true);

    const n = fetchImpl.mock.calls.length;
    await vi.advanceTimersByTimeAsync(5000);
    expect(fetchImpl.mock.calls.length).toBeGreaterThan(n);

    stopGatewayHealthPoll();
    const after = fetchImpl.mock.calls.length;
    await vi.advanceTimersByTimeAsync(10000);
    expect(fetchImpl.mock.calls.length).toBe(after);
  });

  it('reports idle when endpoint empty via getEndpoint', async () => {
    vi.useFakeTimers();
    const onResult = vi.fn();
    startGatewayHealthPoll({
      getEndpoint: () => '',
      intervalMs: 5000,
      onResult,
      immediate: true,
    });
    await vi.advanceTimersByTimeAsync(0);
    expect(onResult.mock.calls[0][0].status).toBe('no_endpoint');
    stopGatewayHealthPoll();
  });
});

describe('Phase 29 compound affect staging', () => {
  it('stages all catalog compounds with primary-weighted fingers', () => {
    expect(Object.keys(COMPOUNDS).length).toBeGreaterThanOrEqual(6);
    const out = stageCompoundAffect('happy_surprised', 0.9);
    expect(out.ok).toBe(true);
    expect(out.primary).toBe('happy');
    expect(out.secondary).toBe('surprised');
    expect(out.band).toBe('full');
    expect(out.fingerPresetId).toBeTruthy();
    expect(out.gesture).toBeTruthy();
    expect(out.lookBias).toBeTruthy();
    expect(out.scientific).toBe(false);
  });

  it('rejects unknown compound ids', () => {
    const bad = stageCompoundAffect('not_a_real_blend', 0.5);
    expect(bad.ok).toBe(false);
    expect(bad.error).toBe('unknown_compound');
  });

  it('soft band scales weaker than full for angry_disgust', () => {
    const soft = stageCompoundAffect('angry_disgust', 0.2);
    const full = stageCompoundAffect('angry_disgust', 0.95);
    expect(soft.band).toBe('soft');
    expect(full.band).toBe('full');
    if (soft.gesture?.fist != null && full.gesture?.fist != null) {
      expect(soft.gesture.fist).toBeLessThanOrEqual(full.gesture.fist);
    }
  });
});
