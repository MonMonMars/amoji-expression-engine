import { describe, expect, it, vi } from 'vitest';
import {
  syncEmblemToFinger,
  syncFingerToEmblem,
  fingerPresetForEmblem,
  emblemForFingerPreset,
} from '../../engine/export/emblemFingerSync.js';
import { resolveFingerPreset } from '../../engine/export/fingerPresets.js';
import { driveRobot } from '../../engine/export/robotDriver.js';
import { remapLiveLinkFrame } from '../../engine/export/controlRigRemap.js';
import { morphsToLiveLinkFrame } from '../../engine/export/liveLinkFace.js';
import {
  expandEndpointTemplate,
  resolveGatewayBase,
  applyTtsPreset,
  listTtsPresets,
  createTtsProviderFromPreset,
} from '../../engine/tts/ttsPresets.js';

describe('Phase 26 emblem ↔ finger sync', () => {
  it('maps catalog emblems to finger presets', () => {
    expect(fingerPresetForEmblem('wave')).toBe('wave');
    expect(fingerPresetForEmblem('thumbsUp')).toBe('thumbs-up');
    expect(fingerPresetForEmblem('stopPalm')).toBe('open-palm');
    expect(fingerPresetForEmblem('point')).toBe('point');
    expect(emblemForFingerPreset('ok')).toBe('ok');
  });

  it('syncEmblemToFinger returns articulated gesture', () => {
    const synced = syncEmblemToFinger('wave');
    expect(synced.synced).toBe(true);
    expect(synced.fingerPresetId).toBe('wave');
    expect(synced.gesture.handOpen).toBeGreaterThan(0.5);
    expect(synced.digits.hand_R_open).toBeGreaterThan(0.5);
  });

  it('thumbs-up preset drives curled fingers with open thumb', () => {
    const thumbs = resolveFingerPreset('thumbs-up');
    expect(thumbs.digits.thumb_R).toBeLessThan(0.2);
    expect(thumbs.digits.index_R).toBeGreaterThan(0.5);
    const driven = driveRobot('upper-body-fingers', {
      emotion: 'happy',
      intensity: 0.7,
      gesture: thumbs.gesture,
    });
    expect(driven.joints.thumb_R.value).toBeLessThan(0.25);
  });

  it('unknown emblem does not sync', () => {
    const miss = syncEmblemToFinger('nope');
    expect(miss.synced).toBe(false);
    expect(syncFingerToEmblem('rest').synced).toBe(false);
  });
});

describe('Phase 26 Live Link remap publish shape', () => {
  it('remapLiveLinkFrame swaps ARKit jaw to Sakura morph name', () => {
    const base = morphsToLiveLinkFrame({ Expressions_jawOpen_max: 0.5 });
    // Use raw ARKit-like frame
    const arkitFrame = {
      protocol: 'amoji.livelink.arkit.v1',
      blendShapes: { jawOpen: 0.55, mouthSmileLeft: 0.3 },
    };
    const remapped = remapLiveLinkFrame(arkitFrame, {
      profileId: 'sakura-expression',
      keepUnmapped: true,
    });
    expect(remapped.remapProfile).toBe('sakura-expression');
    expect(remapped.blendShapes.Expressions_jawOpen_max).toBeCloseTo(0.55, 5);
    expect(base.protocol).toContain('livelink');
  });
});

describe('Phase 26 gateway TTS presets', () => {
  it('lists gateway presets', () => {
    const ids = listTtsPresets().map((p) => p.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'gateway-step',
        'gateway-index',
        'gateway-kokoro',
        'gateway-root',
      ]),
    );
    expect(listTtsPresets().find((p) => p.id === 'gateway-step').gateway).toBe(true);
  });

  it('expands ${AMOJI_TTS_GATEWAY} templates', () => {
    expect(
      expandEndpointTemplate('${AMOJI_TTS_GATEWAY}/v1/tts/step', {
        AMOJI_TTS_GATEWAY: 'https://tts.example.com/',
      }),
    ).toBe('https://tts.example.com/v1/tts/step');
    expect(resolveGatewayBase({ env: { AMOJI_TTS_GATEWAY: 'https://g.example' } })).toBe(
      'https://g.example',
    );
  });

  it('gateway preset without base is not ready', () => {
    const prev = globalThis.__AMOJI_TTS__;
    try {
      delete globalThis.__AMOJI_TTS__;
      const applied = applyTtsPreset('gateway-step', {
        persistBrowser: false,
        env: {},
      });
      expect(applied.needsGateway).toBe(true);
      expect(applied.providerReady).toBe(false);
    } finally {
      if (prev === undefined) delete globalThis.__AMOJI_TTS__;
      else globalThis.__AMOJI_TTS__ = prev;
    }
  });

  it('gateway preset with base builds HTTP provider', async () => {
    const prev = globalThis.__AMOJI_TTS__;
    try {
      const fetchImpl = vi.fn(async () => ({
        ok: true,
        json: async () => ({
          provider: 'step-audio-editx',
          text: 'Hi',
          audioUrl: '/data/tts/fixtures/hello-mama.wav',
          phonemes: [{ ipa: 'h', start: 0, end: 0.1 }],
        }),
      }));
      const applied = applyTtsPreset('gateway-step', {
        persistBrowser: true,
        env: {
          AMOJI_TTS_GATEWAY: 'https://tts.example.com',
          AMOJI_TTS_TOKEN: 'tok',
        },
      });
      expect(applied.config.endpoint).toBe('https://tts.example.com/v1/tts/step');
      expect(applied.config.readyForHttp).toBe(true);
      const provider = createTtsProviderFromPreset('gateway-step', {
        fetchImpl,
        env: {
          AMOJI_TTS_GATEWAY: 'https://tts.example.com',
          AMOJI_TTS_TOKEN: 'tok',
        },
      });
      await provider.synthesize({ text: 'Hi' });
      expect(fetchImpl.mock.calls[0][0]).toBe('https://tts.example.com/v1/tts/step');
      expect(fetchImpl.mock.calls[0][1].headers.Authorization).toBe('Bearer tok');
    } finally {
      if (prev === undefined) delete globalThis.__AMOJI_TTS__;
      else globalThis.__AMOJI_TTS__ = prev;
    }
  });
});
