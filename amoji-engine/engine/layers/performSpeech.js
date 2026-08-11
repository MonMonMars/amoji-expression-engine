import { evaluateEmotion } from './emotionFormulas.js';
import { applyMouthToParams, resolveMouth } from './resolveMouth.js';
import { textToVisemeSequence } from './viseme.js';
import {
  sampleCoarticulatedFrames,
  timedVisemeSequence,
} from './coarticulation.js';
import {
  samplePhonemeTimedFrames,
  normalizeParalinguisticTags,
  paralinguisticToHook,
} from './phonemeTiming.js';
import { applyComplianceGate } from '../compliance/complianceGate.js';

/**
 * Build a speaking performance: upper face from emotion, mouth from viseme override.
 *
 * @param {string} text
 * @param {string} emotion
 * @param {number} [intensity=1]
 * @param {import('../types.js').ComplianceContext & {
 *   mode?: 'discrete' | 'coarticulated' | 'phoneme_timed',
 *   fps?: number,
 *   charDuration?: number,
 *   phonemes?: Array<object|Array>,
 *   paralinguistics?: Array<object>,
 * }} [context]
 */
export function performSpeech(text, emotion, intensity = 1, context = {}) {
  const emotionOut = evaluateEmotion(emotion, intensity);
  const gatedEmotion = applyComplianceGate(emotionOut, context);
  const baseParams = gatedEmotion.params ?? {};
  const hasPhonemes = Array.isArray(context.phonemes) && context.phonemes.length > 0;
  const mode = hasPhonemes
    ? 'phoneme_timed'
    : context.mode === 'coarticulated'
      ? 'coarticulated'
      : 'discrete';

  const paraTags = normalizeParalinguisticTags(context.paralinguistics || []);
  const paraHooks = paraTags.map((ev) => ({
    ...ev,
    ...paralinguisticToHook(ev.tag, { arousal: intensity }),
  }));

  if (mode === 'phoneme_timed') {
    const sampled = samplePhonemeTimedFrames(context.phonemes, {
      fps: context.fps ?? 30,
      emotionParams: baseParams,
      intensity,
      text,
    });
    const frames = sampled.frames.map((f) =>
      applyComplianceGate(
        {
          kind: 'speech_frame',
          emotion,
          intensity,
          params: f.params,
          meta: {
            t: f.t,
            viseme: f.viseme,
            mouth: f.mouth,
            upperFaceFrom: 'emotion',
            lowerFaceFrom: 'tts_phoneme_timing',
            coarticulated: true,
            phonemeTimed: true,
          },
        },
        context,
      ),
    );
    return {
      text,
      emotion,
      intensity,
      mode: 'phoneme_timed',
      duration: sampled.duration,
      fps: sampled.fps,
      sequence: sampled.sequence,
      events: sampled.events,
      paralinguistics: paraHooks,
      frames,
    };
  }

  if (mode === 'coarticulated') {
    const sampled = sampleCoarticulatedFrames(text, {
      fps: context.fps ?? 30,
      charDuration: context.charDuration ?? 0.08,
      emotionParams: baseParams,
      intensity,
    });
    const frames = sampled.frames.map((f) =>
      applyComplianceGate(
        {
          kind: 'speech_frame',
          emotion,
          intensity,
          params: f.params,
          meta: {
            t: f.t,
            viseme: f.viseme,
            mouth: f.mouth,
            upperFaceFrom: 'emotion',
            lowerFaceFrom: 'cohen_massaro_dominance',
            coarticulated: true,
          },
        },
        context,
      ),
    );
    return {
      text,
      emotion,
      intensity,
      mode: 'coarticulated',
      duration: sampled.duration,
      fps: sampled.fps,
      sequence: sampled.sequence,
      paralinguistics: paraHooks,
      frames,
    };
  }

  const sequence = textToVisemeSequence(text).map(({ char, viseme }) => {
    const mouth = resolveMouth(viseme, baseParams, intensity);
    const params = applyMouthToParams(baseParams, mouth);
    const frame = applyComplianceGate(
      {
        kind: 'speech_frame',
        emotion,
        intensity,
        params,
        meta: {
          char,
          viseme,
          mouth,
          upperFaceFrom: 'emotion',
          lowerFaceFrom: 'viseme_override',
          coarticulated: false,
        },
      },
      context,
    );
    return frame;
  });

  return {
    text,
    emotion,
    intensity,
    mode: 'discrete',
    frames: sequence,
    sequence: timedVisemeSequence(text),
    paralinguistics: paraHooks,
  };
}
