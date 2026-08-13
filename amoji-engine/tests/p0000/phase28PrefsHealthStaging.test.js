import { describe, expect, it, vi } from 'vitest';
import {
  exportFaceLivePrefsJson,
  importFaceLivePrefsJson,
  clearFaceLivePrefs,
  loadFaceLivePrefs,
} from '../../engine/ui/faceLivePrefs.js';
import {
  stageAffect,
  resolveAffectKey,
  affectStagingBand,
} from '../../engine/export/affectStaging.js';
import {
  healthUrlForEndpoint,
  probeTtsGateway,
} from '../../engine/tts/ttsHealth.js';
import { fingerPresetForAffect } from '../../engine/export/emblemFingerSync.js';

describe('Phase 28 prefs export/import', () => {
  it('round-trips JSON export → import', () => {
    clearFaceLivePrefs({ memory: true });
    const exported = exportFaceLivePrefsJson({
      prefs: { emotion: 'fear', fingerPresetId: 'self-hug', ttsPresetId: 'gateway-step' },
    });
    expect(exported.json).toContain('amoji.faceLive.prefs');
    const imported = importFaceLivePrefsJson(exported.json, { memory: true });
    expect(imported.ok).toBe(true);
    expect(imported.prefs.emotion).toBe('fear');
    expect(imported.prefs.fingerPresetId).toBe('self-hug');
    expect(loadFaceLivePrefs({ memory: true }).prefs.ttsPresetId).toBe('gateway-step');
  });

  it('rejects invalid JSON', () => {
    const bad = importFaceLivePrefsJson('{nope', { persist: false });
    expect(bad.ok).toBe(false);
    expect(bad.error).toBe('invalid_json');
  });
});

describe('Phase 28 affect staging', () => {
  it('aliases mood labels and scales by intensity band', () => {
    expect(resolveAffectKey('embarrassed')).toBe('sad');
    expect(affectStagingBand(0.2)).toBe('soft');
    expect(affectStagingBand(0.9)).toBe('full');
    const soft = stageAffect('angry', 0.2);
    const full = stageAffect('angry', 0.95);
    expect(soft.band).toBe('soft');
    expect(full.band).toBe('full');
    expect(soft.gesture.fist).toBeLessThan(full.gesture.fist);
    expect(soft.lookBias).toBeTruthy();
  });

  it('maps expanded affect keys including melancholy', () => {
    expect(fingerPresetForAffect('melancholy')).toBe('self-hug');
    expect(fingerPresetForAffect('anxious')).toBe('pinch');
    expect(stageAffect('thinking', 0.8).fingerPresetId).toBe('chin-rest');
  });
});

describe('Phase 28 gateway health probe', () => {
  it('derives /health URL from synthesize path', () => {
    expect(healthUrlForEndpoint('https://tts.example.com/v1/tts/step')).toBe(
      'https://tts.example.com/v1/tts/health',
    );
  });

  it('marks 200 as up and 401 as up·auth', async () => {
    const ok = await probeTtsGateway({
      endpoint: 'https://tts.example.com/synthesize',
      fetchImpl: vi.fn(async () => ({ status: 200 })),
    });
    expect(ok.ok).toBe(true);
    expect(ok.tone).toBe('ok');

    const auth = await probeTtsGateway({
      endpoint: 'https://tts.example.com/synthesize',
      fetchImpl: vi.fn(async () => ({ status: 401 })),
    });
    expect(auth.ok).toBe(true);
    expect(auth.tone).toBe('warn');
    expect(auth.message).toMatch(/auth/);
  });

  it('marks network errors as down', async () => {
    const down = await probeTtsGateway({
      endpoint: 'https://tts.example.com/synthesize',
      fetchImpl: vi.fn(async () => {
        throw new Error('offline');
      }),
    });
    expect(down.ok).toBe(false);
    expect(down.tone).toBe('bad');
  });
});
