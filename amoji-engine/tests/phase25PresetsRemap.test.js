import { describe, expect, it, vi } from 'vitest';
import {
  listFingerPresets,
  getFingerPreset,
  resolveFingerPreset,
  DEFAULT_FINGER_PRESET,
} from '../engine/export/fingerPresets.js';
import { driveRobot, getRobotPack } from '../engine/export/robotDriver.js';
import {
  listTtsPresets,
  getTtsPreset,
  applyTtsPreset,
  createTtsProviderFromPreset,
  DEFAULT_TTS_PRESET,
} from '../engine/tts/ttsPresets.js';
import { remapArkitToMorphs } from '../engine/export/controlRigRemap.js';

describe('Phase 25 finger presets', () => {
  it('lists staging presets including fist / point / wave', () => {
    const ids = listFingerPresets().map((p) => p.id);
    expect(DEFAULT_FINGER_PRESET).toBe('rest');
    expect(ids).toEqual(
      expect.arrayContaining([
        'rest',
        'fist',
        'open-palm',
        'point',
        'ok',
        'wave',
        'pinch',
        'thumbs-up',
      ]),
    );
  });

  it('resolveFingerPreset articulates digits', () => {
    const fist = resolveFingerPreset('fist');
    expect(fist.gesture.fist).toBeGreaterThan(0.8);
    expect(fist.digits.hand_R_fist).toBeGreaterThan(0.8);
    expect(fist.digits.pinky_R).toBeGreaterThan(fist.digits.index_R);
  });

  it('point preset keeps index open on right', () => {
    const point = resolveFingerPreset('point');
    expect(point.gesture.armR.index).toBeLessThan(0.2);
    expect(point.digits.index_R).toBeLessThan(0.2);
    expect(point.digits.middle_R).toBeGreaterThan(0.5);
  });

  it('driveRobot applies finger preset gesture on fingers pack', () => {
    const resolved = resolveFingerPreset('open-palm');
    const driven = driveRobot('upper-body-fingers', {
      emotion: 'happy',
      intensity: 0.7,
      gesture: resolved.gesture,
    });
    expect(getRobotPack('upper-body-fingers').joints.spread_R).toBeTruthy();
    expect(driven.joints.hand_R_open.value).toBeGreaterThan(0.5);
    expect(driven.joints.spread_R.value).toBeGreaterThan(0.3);
  });
});

describe('Phase 25 TTS provider presets', () => {
  it('lists mock + vendor templates', () => {
    const ids = listTtsPresets().map((p) => p.id);
    expect(DEFAULT_TTS_PRESET).toBe('mock');
    expect(ids).toEqual(
      expect.arrayContaining(['mock', 'step-audio', 'indextts2', 'kokoro', 'local-smoke']),
    );
    expect(getTtsPreset('kokoro').provider).toBe('kokoro');
  });

  it('mock preset builds mock provider', async () => {
    const prev = globalThis.__AMOJI_TTS__;
    try {
      const applied = applyTtsPreset('mock');
      expect(applied.config.type).toBe('mock');
      const provider = createTtsProviderFromPreset('mock');
      expect(provider.id).toBe('mock');
      const out = await provider.synthesize({ text: 'Hello mama.' });
      expect(out.normalized.readyForSpeech).toBe(true);
    } finally {
      if (prev === undefined) delete globalThis.__AMOJI_TTS__;
      else globalThis.__AMOJI_TTS__ = prev;
    }
  });

  it('http preset wires endpoint + bearer for local-smoke', async () => {
    const prev = globalThis.__AMOJI_TTS__;
    try {
      const fetchImpl = vi.fn(async () => ({
        ok: true,
        json: async () => ({
          provider: 'smoke-echo',
          text: 'Hi',
          audioUrl: '/data/tts/fixtures/hello-mama.wav',
          phonemes: [{ ipa: 'h', start: 0, end: 0.1 }],
        }),
      }));
      const applied = applyTtsPreset('local-smoke', { persistBrowser: true });
      expect(applied.config.readyForHttp).toBe(true);
      expect(applied.config.hasToken).toBe(true);
      const provider = createTtsProviderFromPreset('local-smoke', { fetchImpl });
      await provider.synthesize({ text: 'Hi' });
      expect(fetchImpl.mock.calls[0][1].headers.Authorization).toMatch(/^Bearer /);
    } finally {
      if (prev === undefined) delete globalThis.__AMOJI_TTS__;
      else globalThis.__AMOJI_TTS__ = prev;
    }
  });
});

describe('Phase 25 UE remap parity', () => {
  it('JS sakura remap matches expected morph names used by consumer', () => {
    const out = remapArkitToMorphs(
      { jawOpen: 0.6, mouthSmileLeft: 0.4 },
      { profileId: 'sakura-expression', keepUnmapped: false },
    );
    expect(out.morphs.Expressions_jawOpen_max).toBeCloseTo(0.6, 5);
    expect(out.morphs.Expressions_mouthSmileL_max).toBeCloseTo(0.4, 5);
  });
});
