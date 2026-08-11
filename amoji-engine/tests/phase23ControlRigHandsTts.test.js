import { describe, expect, it, vi } from 'vitest';
import {
  listRemapProfiles,
  getRemapProfile,
  remapArkitToMorphs,
  remapMorphsToArkit,
  remapLiveLinkFrame,
  invertRemap,
} from '../engine/export/controlRigRemap.js';
import { getRobotPack, driveRobot, mapFrameToJoints } from '../engine/export/robotDriver.js';
import {
  resolveTtsConfig,
  createTtsProviderFromConfig,
  setBrowserTtsConfig,
} from '../engine/tts/ttsConfig.js';
import { getChassis } from '../engine/export/chassisCalibrate.js';

describe('Control Rig remap samples', () => {
  it('lists identity / sakura / metahuman profiles', () => {
    const ids = listRemapProfiles().map((p) => p.id);
    expect(ids).toContain('identity');
    expect(ids).toContain('sakura-expression');
    expect(ids).toContain('metahuman-ctrlrig-sample');
  });

  it('remaps ARKit jawOpen to Sakura morph name', () => {
    const out = remapArkitToMorphs(
      { jawOpen: 0.6, mouthSmileLeft: 0.4, unknownChan: 0.2 },
      { profileId: 'sakura-expression', keepUnmapped: true },
    );
    expect(out.morphs.Expressions_jawOpen_max).toBeCloseTo(0.6, 5);
    expect(out.morphs.Expressions_mouthSmileL_max).toBeCloseTo(0.4, 5);
    expect(out.morphs.unknownChan).toBeCloseTo(0.2, 5);
    expect(out.mapped).toBe(2);
  });

  it('inverse remap recovers ARKit channel', () => {
    const inv = invertRemap(getRemapProfile('metahuman-ctrlrig-sample').map);
    expect(inv.CTRL_Expressions_jawOpen).toBe('jawOpen');
    const back = remapMorphsToArkit(
      { CTRL_Expressions_jawOpen: 0.55 },
      { profileId: 'metahuman-ctrlrig-sample' },
    );
    expect(back.blendShapes.jawOpen).toBeCloseTo(0.55, 5);
  });

  it('remaps Live Link frame blendShapes', () => {
    const frame = remapLiveLinkFrame(
      {
        protocol: 'amoji.livelink.arkit.v1',
        blendShapes: { jawOpen: 0.3, eyeBlinkLeft: 0.8 },
      },
      { profileId: 'sakura-expression', keepUnmapped: false },
    );
    expect(frame.remapProfile).toBe('sakura-expression');
    expect(frame.morphs.Expressions_jawOpen_max).toBeCloseTo(0.3, 5);
    expect(frame.blendShapes.jawOpen).toBeUndefined();
  });
});

describe('upper-body-hands pack', () => {
  it('adds 8 hand DOF on companion base', () => {
    const pack = getRobotPack('upper-body-hands');
    expect(pack.joints.hand_L_fist).toBeTruthy();
    expect(pack.joints.index_R).toBeTruthy();
    expect(pack.joints.jaw).toBeTruthy();
    expect(pack.dof).toBe(getRobotPack('upper-body-companion').dof + 8);
  });

  it('maps gesture fist/open into hand joints', () => {
    const pack = getRobotPack('upper-body-hands');
    const raw = mapFrameToJoints(pack, {
      emotion: 'happy',
      intensity: 0.8,
      gesture: { fist: 0.7, handOpen: 0.9 },
    });
    expect(raw.hand_R_fist).toBeCloseTo(0.7, 5);
    expect(raw.hand_R_open).toBeLessThan(0.9);
    expect(raw.index_R).toBeGreaterThan(0.4);
  });

  it('driveRobot + lobby-companion-hands chassis', () => {
    expect(getChassis('lobby-companion-hands').packId).toBe('upper-body-hands');
    const driven = driveRobot('upper-body-hands', {
      emotion: 'happy',
      intensity: 0.8,
      chassisId: 'lobby-companion-hands',
      gesture: { fist: 0.5, handOpen: 0.6 },
    });
    expect(driven.packId).toBe('upper-body-hands');
    expect(driven.joints.hand_L_fist).toBeTruthy();
  });
});

describe('TTS HTTP config wiring', () => {
  it('defaults to mock without endpoint', () => {
    const cfg = resolveTtsConfig({ env: {}, browser: null });
    expect(cfg.type).toBe('mock');
    expect(cfg.readyForHttp).toBe(false);
    const provider = createTtsProviderFromConfig(cfg);
    expect(provider.id).toBe('mock');
  });

  it('builds HTTP provider when endpoint set', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        provider: 'indextts2',
        text: 'Hi',
        audioUrl: 'https://cdn.example/hi.wav',
        phonemes: [{ phone: 'HH', start: 0, end: 0.1, viseme: 'AI' }],
      }),
    }));
    const cfg = resolveTtsConfig({
      env: {
        AMOJI_TTS_ENDPOINT: 'https://tts.example/synthesize',
        AMOJI_TTS_PROVIDER: 'indextts2',
        AMOJI_TTS_TOKEN: 'secret',
      },
      browser: null,
    });
    expect(cfg.readyForHttp).toBe(true);
    expect(cfg.hasToken).toBe(true);
    const provider = createTtsProviderFromConfig(cfg, { fetchImpl });
    expect(provider.id).toBe('http');
    const out = await provider.synthesize({ text: 'Hi' });
    expect(out.audioUrl).toBe('https://cdn.example/hi.wav');
    expect(fetchImpl).toHaveBeenCalledOnce();
    const init = fetchImpl.mock.calls[0][1];
    expect(init.headers.Authorization).toBe('Bearer secret');
  });

  it('setBrowserTtsConfig updates globalThis', () => {
    const prev = globalThis.__AMOJI_TTS__;
    try {
      const cfg = setBrowserTtsConfig({
        endpoint: 'https://tts.local/syn',
        provider: 'kokoro',
      });
      expect(cfg.readyForHttp).toBe(true);
      expect(globalThis.__AMOJI_TTS__.endpoint).toBe('https://tts.local/syn');
    } finally {
      if (prev === undefined) delete globalThis.__AMOJI_TTS__;
      else globalThis.__AMOJI_TTS__ = prev;
    }
  });
});
