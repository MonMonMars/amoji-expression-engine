import { describe, expect, it } from 'vitest';
import {
  listRemapProfiles,
  remapArkitToMorphs,
} from '../../engine/export/controlRigRemap.js';
import {
  digitCurl,
  fingerSpread,
  articulateFingers,
} from '../../engine/export/fingerArticulation.js';
import { getRobotPack, mapFrameToJoints, driveRobot } from '../../engine/export/robotDriver.js';
import { getChassis } from '../../engine/export/chassisCalibrate.js';
import {
  startAuthEchoServer,
  runAuthenticatedTtsSmoke,
} from '../../engine/tts/ttsSmoke.js';

describe('Phase 24 Control Rig profiles', () => {
  it('includes CC4 and UE5 flat morph profiles', () => {
    const ids = listRemapProfiles().map((p) => p.id);
    expect(ids).toContain('cc4-arkit');
    expect(ids).toContain('ue5-morph-flat');
  });

  it('remaps via cc4 and ue5 profiles', () => {
    const cc4 = remapArkitToMorphs({ jawOpen: 0.5 }, { profileId: 'cc4-arkit' });
    expect(cc4.morphs.V_Open).toBeCloseTo(0.5, 5);
    const ue5 = remapArkitToMorphs(
      { eyeBlinkLeft: 0.8 },
      { profileId: 'ue5-morph-flat', keepUnmapped: false },
    );
    expect(ue5.morphs.MorphTarget_eyeBlinkLeft).toBeCloseTo(0.8, 5);
  });
});

describe('Phase 24 finger articulation', () => {
  it('cascades curl pinky > index for same fist', () => {
    expect(digitCurl(0.8, 4)).toBeGreaterThan(digitCurl(0.8, 1));
    expect(fingerSpread(0.9, 0.8)).toBeLessThan(fingerSpread(0.1, 0.8));
  });

  it('articulateFingers fills middle/ring/pinky/spread', () => {
    const digits = articulateFingers({ fist: 0.75, handOpen: 0.4 });
    expect(digits.middle_R).toBeGreaterThan(0.4);
    expect(digits.pinky_R).toBeGreaterThan(digits.index_R);
    expect(digits.spread_R).toBeGreaterThan(0);
  });

  it('upper-body-fingers pack maps cascade curls', () => {
    const pack = getRobotPack('upper-body-fingers');
    expect(pack.joints.pinky_L).toBeTruthy();
    expect(pack.joints.spread_R).toBeTruthy();
    expect(pack.dof).toBe(getRobotPack('upper-body-hands').dof + 8);
    const raw = mapFrameToJoints(pack, {
      emotion: 'happy',
      gesture: { fist: 0.8, handOpen: 0.3 },
    });
    expect(raw.pinky_R).toBeGreaterThan(raw.index_R);
    expect(raw.spread_L).toBeLessThan(0.5);
  });

  it('lobby-companion-fingers chassis drives pack', () => {
    expect(getChassis('lobby-companion-fingers').packId).toBe('upper-body-fingers');
    const driven = driveRobot('upper-body-fingers', {
      emotion: 'happy',
      intensity: 0.7,
      chassisId: 'lobby-companion-fingers',
      gesture: { fist: 0.6, handOpen: 0.5 },
    });
    expect(driven.joints.middle_L).toBeTruthy();
    expect(driven.joints.spread_R).toBeTruthy();
  });
});

describe('Phase 24 authenticated TTS smoke', () => {
  it('local echo rejects missing bearer then smoke passes with token', async () => {
    const echo = await startAuthEchoServer({ token: 'test-token' });
    try {
      const bad = await fetch(echo.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'x' }),
      });
      expect(bad.status).toBe(401);

      const smoke = await runAuthenticatedTtsSmoke({
        env: {
          AMOJI_TTS_ENDPOINT: echo.url,
          AMOJI_TTS_TOKEN: 'test-token',
          AMOJI_TTS_PROVIDER: 'smoke-echo',
        },
        useLocalEcho: false,
        text: 'Hello mama.',
      });
      expect(smoke.ok).toBe(true);
      expect(smoke.hasToken).toBe(true);
      expect(smoke.phonemeCount).toBeGreaterThan(3);
      expect(smoke.audioUrl).toContain('hello-mama.wav');
    } finally {
      await echo.close();
    }
  });

  it('defaults to local echo when no endpoint configured', async () => {
    const smoke = await runAuthenticatedTtsSmoke({
      env: {},
      useLocalEcho: true,
    });
    expect(smoke.ok).toBe(true);
    expect(smoke.mode).toBe('local_echo');
    expect(smoke.authRequired).toBe(true);
  });
});
