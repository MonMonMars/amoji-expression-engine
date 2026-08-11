/**
 * Production TTS phoneme timing → Preston Blair viseme onsets.
 * Accepts timestamped phonemes from Step Audio / IndexTTS / Kokoro-style APIs.
 */
import phonemeMap from '../../data/visemes/phoneme-to-viseme.json' with { type: 'json' };
import { normalizeVisemeKey } from './viseme.js';
import { sampleCoarticulatedFrames, resolveMouthAtTime } from './coarticulation.js';
import { applyMouthToParams } from './resolveMouth.js';
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const PHONEME_TO_VISEME = phonemeMap.map;
export const DEFAULT_PHONEME_VISEME = phonemeMap.defaultViseme || 'CONS';

/**
 * @param {string} phoneme
 * @returns {string} viseme key
 */
export function phonemeToViseme(phoneme) {
  if (phoneme == null || phoneme === '') return 'REST';
  const raw = String(phoneme).trim();
  if (!raw) return 'REST';
  const candidates = [
    raw,
    raw.toLowerCase(),
    raw.toUpperCase(),
    raw.replace(/[0-9]+$/g, ''),
    raw.replace(/[0-9]+$/g, '').toUpperCase(),
  ];
  for (const c of candidates) {
    if (PHONEME_TO_VISEME[c]) return normalizeVisemeKey(PHONEME_TO_VISEME[c]);
  }
  if (/^[a-zA-Z]$/.test(raw)) return normalizeVisemeKey(DEFAULT_PHONEME_VISEME);
  return normalizeVisemeKey(DEFAULT_PHONEME_VISEME);
}

/**
 * Normalize heterogeneous TTS phoneme payloads into { phoneme, onset, duration?, char? }.
 * Supports:
 *   - { phoneme|phone|ipa|arpabet, start|onset|t|begin, end|duration? }
 *   - [phoneme, start, end]
 * @param {Array<object|Array>} phonemes
 * @returns {{ phoneme: string, onset: number, duration: number, viseme: string, char?: string }[]}
 */
export function normalizePhonemeEvents(phonemes) {
  if (!Array.isArray(phonemes)) return [];
  /** @type {{ phoneme: string, onset: number, duration: number, viseme: string, char?: string }[]} */
  const out = [];
  for (const item of phonemes) {
    if (Array.isArray(item)) {
      const phoneme = String(item[0] ?? '');
      const onset = Number(item[1] ?? 0);
      const end = Number(item[2] ?? onset);
      out.push({
        phoneme,
        onset,
        duration: Math.max(0, end - onset),
        viseme: phonemeToViseme(phoneme),
      });
      continue;
    }
    if (!item || typeof item !== 'object') continue;
    const phoneme = String(
      item.phoneme ?? item.phone ?? item.ipa ?? item.arpabet ?? item.symbol ?? '',
    );
    const onset = Number(item.start ?? item.onset ?? item.t ?? item.begin ?? 0);
    let duration = 0;
    if (typeof item.duration === 'number') duration = item.duration;
    else if (typeof item.end === 'number') duration = Math.max(0, item.end - onset);
    else if (typeof item.finish === 'number') duration = Math.max(0, item.finish - onset);
    out.push({
      phoneme,
      onset,
      duration,
      viseme: phonemeToViseme(phoneme),
      char: item.char || item.grapheme || undefined,
    });
  }
  out.sort((a, b) => a.onset - b.onset);
  return out;
}

/**
 * Collapse consecutive identical visemes (optional) and build TimedViseme sequence.
 * @param {Array<object|Array>} phonemes
 * @param {{ mergeSame?: boolean }} [opts]
 * @returns {{ viseme: string, onset: number, phoneme?: string, char?: string }[]}
 */
export function phonemesToTimedVisemes(phonemes, opts = {}) {
  const events = normalizePhonemeEvents(phonemes);
  const mergeSame = opts.mergeSame !== false;
  /** @type {{ viseme: string, onset: number, phoneme?: string, char?: string }[]} */
  const seq = [];
  for (const e of events) {
    const last = seq[seq.length - 1];
    if (mergeSame && last && last.viseme === e.viseme) continue;
    seq.push({
      viseme: e.viseme,
      onset: e.onset,
      phoneme: e.phoneme,
      char: e.char,
    });
  }
  return seq;
}

/**
 * Duration of a phoneme timeline (last onset + duration, or gap estimate).
 * @param {ReturnType<typeof normalizePhonemeEvents>} events
 */
export function phonemeTimelineDuration(events) {
  if (!events.length) return 0;
  let max = 0;
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const end =
      e.duration > 0
        ? e.onset + e.duration
        : events[i + 1]
          ? events[i + 1].onset
          : e.onset + 0.08;
    if (end > max) max = end;
  }
  return max + 0.06;
}

/**
 * Sample coarticulated frames driven by TTS phoneme timestamps (not equal char slots).
 * @param {Array<object|Array>} phonemes
 * @param {{
 *   fps?: number,
 *   emotionParams?: object,
 *   intensity?: number,
 *   text?: string,
 * }} [opts]
 */
export function samplePhonemeTimedFrames(phonemes, opts = {}) {
  const fps = opts.fps ?? 30;
  const intensity = opts.intensity ?? 1;
  const emotionParams = opts.emotionParams ?? {};
  const events = normalizePhonemeEvents(phonemes);
  const sequence = phonemesToTimedVisemes(events);
  const duration = Math.max(0.12, phonemeTimelineDuration(events));
  const dt = 1 / fps;
  /** @type {object[]} */
  const frames = [];
  for (let t = 0; t <= duration + 1e-9; t += dt) {
    const mouth = resolveMouthAtTime(sequence, t, emotionParams, intensity);
    frames.push({
      t,
      mouth,
      params: applyMouthToParams(emotionParams, mouth),
      viseme: mouth.viseme,
    });
  }
  return applyComplianceGate(
    {
      kind: 'phoneme_timed_speech',
      text: opts.text || '',
      sequence,
      events,
      duration,
      frames,
      fps,
      mode: 'phoneme_timed',
    },
    {},
  );
}

/**
 * Paralinguistic tag events from TTS (laughter / sigh / breathing / chuckle).
 * @param {Array<{ tag: string, t?: number, start?: number, timestamp?: number }>} tags
 */
export function normalizeParalinguisticTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => ({
      tag: String(tag.tag || tag.type || '').toLowerCase(),
      t: Number(tag.t ?? tag.start ?? tag.timestamp ?? 0),
    }))
    .filter((t) => t.tag)
    .sort((a, b) => a.t - b.t);
}

/**
 * Map a paralinguistic tag to an engine hook descriptor.
 * @param {string} tag
 * @param {{ arousal?: number }} [ctx]
 */
export function paralinguisticToHook(tag, ctx = {}) {
  const t = String(tag || '').toLowerCase();
  if (t === 'laughter' || t === 'laugh') {
    return {
      hook: 'laugh',
      headBobIntensity: ctx.arousal ?? 0.7,
      torsoDerivation: true,
    };
  }
  if (t === 'sigh') {
    return { hook: 'sigh', accessoryBoost: 0.6, exhaleEmphasis: true };
  }
  if (t === 'breathing' || t === 'breath') {
    return { hook: 'breath_sync', syncIdleBreath: true };
  }
  if (t === 'chuckle') {
    return { hook: 'chuckle', smileKind: 'affiliation' };
  }
  return { hook: 'unknown', tag: t };
}

export { sampleCoarticulatedFrames };
