import { evaluateEmotion } from './emotionFormulas.js';
import { applyMouthToParams, resolveMouth } from './resolveMouth.js';
import { textToVisemeSequence } from './viseme.js';
import { applyComplianceGate } from '../compliance/complianceGate.js';

/**
 * Build a speaking performance: upper face from emotion, mouth from viseme override.
 * Discrete MVP — coarticulation (Cohen-Massaro) is TODO for a later phase.
 *
 * @param {string} text
 * @param {string} emotion
 * @param {number} [intensity=1]
 * @param {import('../types.js').ComplianceContext} [context]
 */
export function performSpeech(text, emotion, intensity = 1, context = {}) {
  const emotionOut = evaluateEmotion(emotion, intensity);
  const gatedEmotion = applyComplianceGate(emotionOut, context);
  const baseParams = gatedEmotion.params ?? {};

  const sequence = textToVisemeSequence(text).map(({ char, viseme }) => {
    const mouth = resolveMouth(viseme, baseParams, intensity);
    const params = applyMouthToParams(baseParams, mouth);
    // Upper-face sanity: brows/eyes must remain identical to emotion-only params
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
          // TODO(Phase later): Cohen-Massaro coarticulation continuous blend
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
    frames: sequence,
  };
}
