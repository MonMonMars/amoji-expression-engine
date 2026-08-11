import { describe, expect, it, vi } from 'vitest';
import {
  resolveAudioUrl,
  MockTtsProvider,
  HttpTtsProvider,
  createTtsProvider,
  playWithProvider,
} from '../engine/tts/ttsProvider.js';
import { SpeechPlayer } from '../engine/tts/speechPlayer.js';
import fixtures from '../data/tts/fixtures/sample-payloads.json' with { type: 'json' };

describe('resolveAudioUrl', () => {
  it('reads audioUrl / audio_url / base64', () => {
    expect(resolveAudioUrl({ audioUrl: '/a.wav' })).toBe('/a.wav');
    expect(resolveAudioUrl({ audio_url: '/b.wav' })).toBe('/b.wav');
    expect(resolveAudioUrl({ audioBase64: 'AAA', audioMime: 'audio/wav' })).toMatch(
      /^data:audio\/wav;base64,AAA$/,
    );
    expect(resolveAudioUrl({})).toBeNull();
  });
});

describe('MockTtsProvider', () => {
  it('returns normalized Step fixture with fixture WAV', async () => {
    const mock = new MockTtsProvider({ fixture: 'stepAudioEditX' });
    const out = await mock.synthesize({ text: 'Hello mama.', emotion: 'happy' });
    expect(out.error).toBeUndefined();
    expect(out.normalized.readyForSpeech).toBe(true);
    expect(out.audioUrl).toContain('hello-mama.wav');
    expect(out.normalized.phonemes.some((p) => p.viseme === 'MBP')).toBe(true);
  });

  it('createTtsProvider defaults to mock', () => {
    const p = createTtsProvider();
    expect(p.id).toBe('mock');
  });
});

describe('HttpTtsProvider', () => {
  it('posts and normalizes JSON with audioUrl', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        provider: 'indextts2',
        text: 'Hi',
        audioUrl: 'https://cdn.example/hi.wav',
        alignment: fixtures.indexTts2.alignment,
        para: fixtures.indexTts2.para,
      }),
    }));
    const http = new HttpTtsProvider({
      endpoint: 'https://tts.example/synthesize',
      fetchImpl,
    });
    const out = await http.synthesize({ text: 'Hi', emotion: 'happy' });
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(out.audioUrl).toBe('https://cdn.example/hi.wav');
    expect(out.normalized.provider).toBe('indextts2');
    expect(out.normalized.phonemes.length).toBeGreaterThan(3);
  });

  it('surfaces http errors', async () => {
    const http = new HttpTtsProvider({
      endpoint: 'https://tts.example/synthesize',
      fetchImpl: async () => ({ ok: false, status: 503, text: async () => 'busy' }),
    });
    const out = await http.synthesize({ text: 'x' });
    expect(out.error).toBe('http_error');
    expect(out.status).toBe(503);
  });
});

describe('playWithProvider', () => {
  it('loads SpeechPlayer from mock and starts clock playback in Node', async () => {
    const player = new SpeechPlayer({ emotion: 'happy', intensity: 0.8 });
    const mock = new MockTtsProvider({
      audioUrl: '/data/tts/fixtures/hello-mama.wav',
    });
    const played = await playWithProvider(
      player,
      mock,
      { text: 'Hello mama.', emotion: 'happy' },
      { demoToneFallback: false },
    );
    expect(played.ok).toBe(true);
    expect(played.audioUrl).toContain('hello-mama.wav');
    expect(player.playing).toBe(true);
    expect(player.performance.mode).toBe('phoneme_timed');
    // Node has no HTMLAudioElement — sync stays clock unless Audio exists
    expect(['clock', 'audio']).toContain(played.syncMode);
  });
});
