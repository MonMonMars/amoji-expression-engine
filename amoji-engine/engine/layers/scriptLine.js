/**
 * Layer 0 — Script line normalize / validate + performScript pipeline.
 */
import schema from '../../data/script/line-schema.json' with { type: 'json' };
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { evaluateEmotion } from './emotionFormulas.js';
import { evaluateCompound, COMPOUNDS } from './compoundEmotion.js';
import { performSpeech } from './performSpeech.js';
import { evaluateSmile, defaultSmileForPersona } from './smileLaugh.js';
import { resolveGazeDirection } from './eyeAnchor.js';
import { evaluateBody } from './neckShoulder.js';
import { applyMoodBias, MoodController, getMoodDef, moodIdleBaseline } from './moodEngine.js';
import { applyContinuity, DiscretionController } from './discretion.js';

export const SCRIPT_GAZE = schema.gazeDirections;
export const MOOD_SUPPRESSION = schema.moodSuppression;

/**
 * @param {unknown} raw
 * @returns {{ ok: boolean, errors: string[], line?: object }}
 */
export function validateScriptLine(raw) {
  const errors = [];
  if (!raw || typeof raw !== 'object') {
    return { ok: false, errors: ['script line must be an object'] };
  }
  /** @type {Record<string, any>} */
  const line = raw;
  if (line.text != null && typeof line.text !== 'string') errors.push('text must be string');
  if (line.dialogue_emotion != null) {
    const de = line.dialogue_emotion;
    if (typeof de === 'string') {
      /* ok — shorthand */
    } else if (typeof de === 'object') {
      if (de.primary == null) errors.push('dialogue_emotion.primary required');
      if (de.intensity != null && typeof de.intensity !== 'number') {
        errors.push('dialogue_emotion.intensity must be number');
      }
    } else errors.push('dialogue_emotion must be string or object');
  }
  if (line.directions?.gaze && !SCRIPT_GAZE.includes(line.directions.gaze)) {
    errors.push(`directions.gaze invalid: ${line.directions.gaze}`);
  }
  if (line.allow_improvisation != null && typeof line.allow_improvisation !== 'boolean') {
    errors.push('allow_improvisation must be boolean');
  }
  return { ok: errors.length === 0, errors, line: errors.length ? undefined : line };
}

/**
 * Normalize heterogeneous script payloads into a canonical ScriptLine.
 * @param {object|string} raw
 */
export function normalizeScriptLine(raw) {
  if (typeof raw === 'string') {
    return normalizeScriptLine({ text: raw, dialogue_emotion: { primary: 'neutral', intensity: 0.3 } });
  }
  const v = validateScriptLine(raw);
  if (!v.ok) {
    throw new Error(`Invalid script line: ${v.errors.join('; ')}`);
  }
  const line = /** @type {Record<string, any>} */ (raw);
  let primary = 'neutral';
  let secondary = null;
  let intensity = 0.7;
  const de = line.dialogue_emotion;
  if (typeof de === 'string') {
    primary = de;
    intensity = typeof line.intensity === 'number' ? line.intensity : 0.7;
  } else if (de && typeof de === 'object') {
    primary = de.primary || 'neutral';
    secondary = de.secondary || null;
    intensity = typeof de.intensity === 'number' ? de.intensity : 0.7;
  }

  const mood =
    typeof line.mood === 'string'
      ? { state: line.mood, baseline_intensity: 0.25 }
      : line.mood && typeof line.mood === 'object'
        ? {
            state: line.mood.state || 'neutral',
            baseline_intensity: line.mood.baseline_intensity ?? 0.25,
          }
        : null;

  const directions = {
    pause_before_ms: line.directions?.pause_before_ms ?? 0,
    gaze: line.directions?.gaze || 'lock',
    step_out_before: !!line.directions?.step_out_before,
    emblem: line.directions?.emblem || null,
    smile: line.directions?.smile || null,
  };

  return applyComplianceGate(
    {
      kind: 'script_line',
      line_id: line.line_id || null,
      text: line.text || '',
      primary,
      secondary,
      intensity,
      mood,
      directions,
      allow_improvisation: line.allow_improvisation !== false,
      persona: line.persona || 'companion',
      phonemes: line.phonemes || null,
      paralinguistics: line.paralinguistics || [],
    },
    {},
  );
}

/**
 * Mood suppresses / leaks into displayed intensity (Layer -1 bias).
 * @param {string} emotion
 * @param {number} intensity
 * @param {{ state?: string, baseline_intensity?: number } | null} mood
 */
export function applyMoodBiasToLine(emotion, intensity, mood) {
  return applyMoodBias(emotion, intensity, mood);
}

// Re-export canonical bias for callers that imported from scriptLine
export { applyMoodBias, MoodController, getMoodDef, moodIdleBaseline };

/**
 * Find compound id for primary+secondary pair if catalogued.
 * @param {string} primary
 * @param {string|null} secondary
 */
export function matchCompound(primary, secondary) {
  if (!secondary) return null;
  for (const [id, def] of Object.entries(COMPOUNDS)) {
    if (def.primary === primary && def.secondary === secondary) return id;
    if (def.primary === secondary && def.secondary === primary) return id;
  }
  // happy_surprised style ids
  const guess = `${secondary}_${primary}`;
  if (COMPOUNDS[guess]) return guess;
  const guess2 = `${primary}_${secondary}`;
  if (COMPOUNDS[guess2]) return guess2;
  return null;
}

/**
 * Perform a full script line → speech frames + gaze + body + smile metadata.
 * @param {object|string} rawLine
 * @param {import('../types.js').ComplianceContext & {
 *   fps?: number,
 *   previousLine?: { emotion: string, intensity: number } | null,
 *   discretion?: DiscretionController | null,
 * }} [context]
 */
export function performScript(rawLine, context = {}) {
  const line = normalizeScriptLine(rawLine);
  const moodBias = applyMoodBias(line.primary, line.intensity, line.mood);
  let intensity = moodBias.intensity;

  const continuity = applyContinuity({
    emotion: line.primary,
    intensity,
    previous: context.previousLine || null,
    stepOutBefore: line.directions.step_out_before,
    personaId: line.persona,
  });
  intensity = continuity.intensity;
  if (context.discretion) {
    context.discretion.ingestLine({
      emotion: continuity.emotion,
      intensity: continuity.intensity,
      stepOutBefore: line.directions.step_out_before,
    });
  }

  const compoundId = matchCompound(line.primary, line.secondary);

  let emotionOut;
  if (compoundId) {
    emotionOut = evaluateCompound(compoundId, intensity);
  } else {
    emotionOut = evaluateEmotion(line.primary, intensity);
  }
  emotionOut = applyComplianceGate(emotionOut, context);

  const moodBaseline =
    line.mood?.state
      ? moodIdleBaseline(line.mood.state, line.mood.baseline_intensity ?? getMoodDef(line.mood.state).baseline)
      : null;

  const smileType =
    line.directions.smile || defaultSmileForPersona(line.persona);
  const smile =
    line.primary === 'happy' || line.primary === 'smile_open'
      ? evaluateSmile(smileType, intensity, { personaId: line.persona })
      : null;

  const gaze = resolveGazeDirection(line.directions.gaze, {
    emotion: line.primary,
    t: 0,
  });
  const gazeLock = line.directions.gaze === 'lock' || line.directions.gaze === 'camera' ? 0.9 : 0.2;
  const body = evaluateBody(line.primary, intensity, {
    lookX: gaze.lookX,
    lookY: gaze.lookY,
    gazeLock,
  });

  let speech = null;
  if (line.text) {
    speech = performSpeech(line.text, line.primary, intensity, {
      ...context,
      mode: line.phonemes ? 'phoneme_timed' : 'coarticulated',
      phonemes: line.phonemes || undefined,
      paralinguistics: line.paralinguistics,
      fps: context.fps ?? 30,
    });
  }

  return applyComplianceGate(
    {
      kind: 'script_performance',
      line,
      emotion: emotionOut,
      compoundId,
      smile,
      gaze,
      body,
      speech,
      timing: {
        pause_before_ms: line.directions.pause_before_ms,
        step_out_before: line.directions.step_out_before,
      },
      moodBias,
      moodBaseline,
      continuity,
    },
    context,
  );
}

export const SCRIPT_EXAMPLE = schema.example;
