import { evaluateEmotion } from './emotionFormulas.js';
import { applyMouthToParams, resolveMouth } from './resolveMouth.js';
import { textToVisemeSequence } from './viseme.js';
import {
  sampleCoarticulatedFrames,
  timedVisemeSequence,
} from './coarticulation.js';
import { applyComplianceGate } from '../compliance/complianceGate.js';

/**
 * Build a speaking performance: upper face from emotion, mouth from viseme override.
 *
 * @param {string} text
 * @param {string} emotion
 * @param {number} [intensity=1]
 * @param {import('../types.js').ComplianceContext & {
 *   mode?: 'discrete' | 'coarticulated',
 *   fps?: number,
 *   charDuration?: number,
 * }} [context]
 */
export function performSpeech(text, emotion, intensity = 1, context = {}) {
  const emotionOut = evaluateEmotion(emotion, intensity);
  const gatedEmotion = applyComplianceGate(emotionOut, context);
  const baseParams = gatedEmotion.params ?? {};
  const mode = context.mode === 'coarticulated' ? 'coarticulated' : 'discrete';

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
  };
}
