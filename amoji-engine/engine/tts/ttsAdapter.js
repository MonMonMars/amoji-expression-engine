/**
 * Production TTS adapter — normalize vendor payloads → phonemes + paralinguistics
 * for performSpeech({ mode: 'phoneme_timed' }). Pure generation sync layer; no audio decode.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import {
  normalizePhonemeEvents,
  normalizeParalinguisticTags,
  phonemeTimelineDuration,
} from '../layers/phonemeTiming.js';
import { estimatePhonemesFromText, estimatePhonemesFromWords } from './estimatePhonemes.js';

export const TTS_PROVIDERS = [
  'step-audio-editx',
  'indextts2',
  'kokoro',
  'generic',
  'auto',
];

/**
 * Detect provider from payload shape.
 * @param {object} payload
 */
export function detectTtsProvider(payload) {
  if (!payload || typeof payload !== 'object') return 'generic';
  if (payload.provider) return String(payload.provider).toLowerCase();
  if (Array.isArray(payload.alignment) || payload.duration_ms != null) return 'indextts2';
  if (Array.isArray(payload.tokens) && payload.tokens[0]?.phoneme) return 'kokoro';
  if (Array.isArray(payload.tags) && (payload.phonemes || payload.ipa)) return 'step-audio-editx';
  if (Array.isArray(payload.phonemes) || Array.isArray(payload.phones)) return 'generic';
  if (Array.isArray(payload.words)) return 'generic';
  return 'generic';
}

/**
 * Extract raw phoneme list from a vendor payload (before normalizePhonemeEvents).
 * @param {object} payload
 * @param {string} [provider]
 */
export function extractRawPhonemes(payload, provider) {
  const p = provider || detectTtsProvider(payload);
  if (p === 'indextts2' && Array.isArray(payload.alignment)) {
    return payload.alignment;
  }
  if (p === 'kokoro' && Array.isArray(payload.tokens)) {
    return payload.tokens;
  }
  if (Array.isArray(payload.phonemes)) return payload.phonemes;
  if (Array.isArray(payload.phones)) return payload.phones;
  if (Array.isArray(payload.ipa)) return payload.ipa;
  return [];
}

/**
 * Extract paralinguistic tags.
 * @param {object} payload
 */
export function extractRawTags(payload) {
  if (Array.isArray(payload.tags)) return payload.tags;
  if (Array.isArray(payload.para)) return payload.para;
  if (Array.isArray(payload.paralinguistics)) return payload.paralinguistics;
  if (Array.isArray(payload.events)) {
    return payload.events.filter((e) => e.tag || e.type);
  }
  return [];
}

/**
 * Normalize any supported TTS response into engine speech input.
 * Falls back to word/text estimation when phonemes are missing.
 * @param {object} payload
 * @param {{
 *   provider?: string,
 *   text?: string,
 *   wps?: number,
 *   preferEstimate?: boolean,
 * }} [opts]
 */
export function normalizeTtsPayload(payload, opts = {}) {
  if (!payload || typeof payload !== 'object') {
    return applyComplianceGate(
      { kind: 'tts_payload', error: 'invalid_payload' },
      {},
    );
  }

  const provider = (opts.provider || detectTtsProvider(payload)).toLowerCase();
  const text = String(opts.text ?? payload.text ?? payload.transcript ?? '');
  let rawPhonemes = extractRawPhonemes(payload, provider);
  let estimateSource = null;

  if ((!rawPhonemes.length || opts.preferEstimate) && Array.isArray(payload.words) && payload.words.length) {
    rawPhonemes = estimatePhonemesFromWords(payload.words);
    estimateSource = 'words';
  } else if (!rawPhonemes.length && text) {
    const duration =
      typeof payload.duration === 'number'
        ? payload.duration
        : typeof payload.duration_ms === 'number'
          ? payload.duration_ms / 1000
          : undefined;
    rawPhonemes = estimatePhonemesFromText(text, {
      durationSec: duration,
      wps: opts.wps,
    });
    estimateSource = 'text';
  }

  const phonemes = normalizePhonemeEvents(rawPhonemes);
  const paralinguistics = normalizeParalinguisticTags(extractRawTags(payload));
  const duration = Math.max(
    phonemeTimelineDuration(phonemes),
    typeof payload.duration === 'number' ? payload.duration : 0,
    typeof payload.duration_ms === 'number' ? payload.duration_ms / 1000 : 0,
  );

  return applyComplianceGate(
    {
      kind: 'tts_payload',
      provider,
      text,
      phonemes,
      paralinguistics,
      duration,
      audioUrl: payload.audioUrl || payload.audio_url || payload.audio || null,
      estimateSource,
      readyForSpeech: phonemes.length > 0,
    },
    {},
  );
}

/**
 * Build performSpeech context from a normalized (or raw) TTS payload.
 * @param {object} payloadOrNormalized
 * @param {{ emotion?: string, intensity?: number, fps?: number }} [opts]
 */
export function ttsToSpeechContext(payloadOrNormalized, opts = {}) {
  const normalized =
    payloadOrNormalized?.kind === 'tts_payload'
      ? payloadOrNormalized
      : normalizeTtsPayload(payloadOrNormalized, opts);

  if (normalized.error || !normalized.readyForSpeech) {
    return {
      ok: false,
      error: normalized.error || 'no_phonemes',
      context: null,
      normalized,
    };
  }

  return {
    ok: true,
    normalized,
    context: {
      mode: 'phoneme_timed',
      phonemes: normalized.phonemes,
      paralinguistics: normalized.paralinguistics,
      fps: opts.fps ?? 30,
      ttsProvider: normalized.provider,
      audioUrl: normalized.audioUrl,
    },
  };
}
