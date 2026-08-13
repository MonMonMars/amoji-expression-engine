import { describe, expect, it } from 'vitest';
import fixtures from '../data/tts/fixtures/sample-payloads.json' with { type: 'json' };
import {
  detectTtsProvider,
  normalizeTtsPayload,
  ttsToSpeechContext,
} from '../../engine/tts/ttsAdapter.js';
import {
  wordToPhones,
  estimatePhonemesFromText,
  estimatePhonemesFromWords,
} from '../../engine/tts/estimatePhonemes.js';
import { SpeechPlayer, frameAtTime } from '../../engine/tts/speechPlayer.js';
import { mouthChannelsToMorphWeights } from '../../engine/tts/mouthMorphs.js';
import { performSpeech } from '../../engine/layers/performSpeech.js';
import { phonemeToViseme } from '../../engine/layers/phonemeTiming.js';

describe('detect + normalize TTS vendors', () => {
  it('detects step / index / kokoro shapes', () => {
    expect(detectTtsProvider(fixtures.stepAudioEditX)).toBe('step-audio-editx');
    expect(detectTtsProvider(fixtures.indexTts2)).toBe('indextts2');
    expect(detectTtsProvider(fixtures.kokoro)).toBe('kokoro');
  });

  it('normalizes Step Audio EditX phonemes + tags', () => {
    const n = normalizeTtsPayload(fixtures.stepAudioEditX);
    expect(n.readyForSpeech).toBe(true);
    expect(n.phonemes.length).toBeGreaterThan(5);
    expect(n.phonemes.some((p) => p.viseme === 'MBP')).toBe(true);
    expect(n.paralinguistics.some((t) => t.tag === 'chuckle')).toBe(true);
    expect(n.duration).toBeGreaterThan(1);
  });

  it('normalizes IndexTTS ARPAbet alignment', () => {
    const n = normalizeTtsPayload(fixtures.indexTts2);
    expect(n.provider).toBe('indextts2');
    expect(n.phonemes[0].viseme).toBe(phonemeToViseme('HH'));
    expect(n.paralinguistics[0].tag).toBe('breath');
  });

  it('normalizes Kokoro tokens', () => {
    const n = normalizeTtsPayload(fixtures.kokoro);
    expect(n.phonemes.some((p) => p.viseme === 'U' || p.viseme === 'O')).toBe(true);
  });

  it('estimates from words-only payload', () => {
    const n = normalizeTtsPayload(fixtures.wordsOnly);
    expect(n.estimateSource).toBe('words');
    expect(n.phonemes.some((p) => p.viseme === 'MBP')).toBe(true);
  });
});

describe('estimatePhonemes', () => {
  it('maps digraphs and MBP letters', () => {
    expect(wordToPhones('the')).toContain('θ');
    expect(wordToPhones('mama').filter((p) => p === 'm').length).toBe(2);
  });

  it('schedules text to cover duration', () => {
    const phones = estimatePhonemesFromText('hi there', { durationSec: 1 });
    expect(phones[0].start).toBe(0);
    expect(phones[phones.length - 1].end).toBeGreaterThan(0.8);
  });

  it('uses word alignments', () => {
    const phones = estimatePhonemesFromWords([
      { word: 'pa', start: 0, end: 0.3 },
      { word: 'pa', start: 0.35, end: 0.65 },
    ]);
    expect(phones.some((p) => p.phoneme === 'p')).toBe(true);
  });
});

describe('tts → performSpeech', () => {
  it('builds phoneme_timed performance from Step fixture', () => {
    const { ok, context } = ttsToSpeechContext(fixtures.stepAudioEditX);
    expect(ok).toBe(true);
    const perf = performSpeech('Hello mama.', 'happy', 0.8, context);
    expect(perf.mode).toBe('phoneme_timed');
    expect(perf.frames.length).toBeGreaterThan(10);
    // MBP region should force near-closed jaw on an early m frame
    const mbp = perf.frames.find((f) => f.meta?.viseme === 'MBP');
    expect(mbp).toBeTruthy();
    expect(mbp.meta.mouth.jaw).toBeLessThan(0.08);
  });
});

describe('SpeechPlayer', () => {
  it('plays estimated text and advances visemes', () => {
    const player = new SpeechPlayer({ emotion: 'happy', intensity: 0.7, fps: 30 });
    const loaded = player.loadText('mama', { durationSec: 0.8 });
    expect(loaded.loaded).toBe(true);
    expect(player.play()).toBe(true);
    const a = player.tick(0.05);
    expect(a.playing).toBe(true);
    expect(a.viseme).toBeTruthy();
    // run to end
    for (let i = 0; i < 40; i++) player.tick(0.05);
    const done = player.tick(0.05);
    expect(done.done || !player.playing).toBe(true);
  });

  it('fires paralinguistic hooks once', () => {
    const player = new SpeechPlayer({ emotion: 'happy', intensity: 0.8 });
    player.loadTts(fixtures.stepAudioEditX);
    player.play();
    /** @type {object[]} */
    const hooks = [];
    for (let i = 0; i < 50; i++) {
      const tick = player.tick(0.05);
      hooks.push(...tick.hooks);
    }
    expect(hooks.some((h) => h.tag === 'chuckle' || h.hook === 'chuckle')).toBe(true);
    expect(player.consumeHooks().length).toBeGreaterThan(0);
  });

  it('frameAtTime picks nearest', () => {
    const frames = [{ meta: { t: 0 } }, { meta: { t: 0.5 } }, { meta: { t: 1 } }];
    expect(frameAtTime(frames, 0.4).meta.t).toBe(0.5);
  });
});

describe('mouthChannelsToMorphWeights', () => {
  it('opens jaw morphs and smiles on corner', () => {
    const w = mouthChannelsToMorphWeights({ jaw: 0.5, width: 0.4, corner: 0.6 });
    expect(
      w.Expressions_mouthOpenLarge_max || w.Expressions_mouthOpen_max,
    ).toBeGreaterThan(0.4);
    expect(w.Expressions_mouthSmile_max).toBeGreaterThan(0.4);
  });
});
