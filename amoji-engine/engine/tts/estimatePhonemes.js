/**
 * Estimate phoneme timelines when TTS returns text/words without phone stamps.
 * Approximate only — prefer real TTS phoneme timestamps in production.
 */

/** Rough IPA-ish phone for Latin letters / CJK syllable placeholder. */
const CHAR_PHONE = {
  a: 'ɑ',
  e: 'ɛ',
  i: 'i',
  o: 'oʊ',
  u: 'u',
  y: 'i',
  m: 'm',
  b: 'b',
  p: 'p',
  f: 'f',
  v: 'v',
  l: 'l',
  r: 'ɹ',
  w: 'w',
  s: 's',
  z: 'z',
  t: 't',
  d: 'd',
  n: 'n',
  k: 'k',
  g: 'ɡ',
  h: 'h',
  j: 'dʒ',
  c: 'k',
  q: 'k',
  x: 'k',
};

const DIGRAPH = {
  th: 'θ',
  sh: 'ʃ',
  ch: 'tʃ',
  ph: 'f',
  wh: 'w',
  oo: 'u',
  ee: 'i',
  ai: 'eɪ',
  ay: 'eɪ',
  oa: 'oʊ',
  ou: 'aʊ',
  ow: 'aʊ',
};

/**
 * @param {string} word
 * @returns {string[]}
 */
export function wordToPhones(word) {
  const w = String(word || '')
    .toLowerCase()
    .replace(/[^a-z\u4e00-\u9fff']/g, '');
  if (!w) return ['sil'];

  // CJK: one phone slot per character (schwa-ish vowel + consonant hint)
  if (/[\u4e00-\u9fff]/.test(w)) {
    /** @type {string[]} */
    const phones = [];
    for (const ch of w) {
      phones.push('ə');
      if (/[\u4e00-\u9fff]/.test(ch)) phones.push('n');
    }
    return phones.length ? phones : ['ə'];
  }

  /** @type {string[]} */
  const phones = [];
  let i = 0;
  while (i < w.length) {
    const dig = w.slice(i, i + 2);
    if (DIGRAPH[dig]) {
      phones.push(DIGRAPH[dig]);
      i += 2;
      continue;
    }
    const ch = w[i];
    if (ch === "'") {
      i += 1;
      continue;
    }
    phones.push(CHAR_PHONE[ch] || 't');
    i += 1;
  }
  return phones.length ? phones : ['ə'];
}

/**
 * Spread phones evenly across [start, end).
 * @param {string[]} phones
 * @param {number} start
 * @param {number} end
 */
export function schedulePhones(phones, start, end) {
  const dur = Math.max(0.05, end - start);
  const slot = dur / phones.length;
  return phones.map((phoneme, i) => ({
    phoneme,
    start: start + i * slot,
    end: start + (i + 1) * slot,
  }));
}

/**
 * Estimate from word alignments.
 * @param {Array<{ word?: string, text?: string, start?: number, end?: number, t?: number, duration?: number }>} words
 */
export function estimatePhonemesFromWords(words) {
  if (!Array.isArray(words)) return [];
  /** @type {object[]} */
  const out = [];
  for (const w of words) {
    const text = String(w.word ?? w.text ?? '');
    const start = Number(w.start ?? w.t ?? 0);
    let end = start;
    if (typeof w.end === 'number') end = w.end;
    else if (typeof w.duration === 'number') end = start + w.duration;
    else end = start + Math.max(0.12, text.length * 0.07);
    const phones = wordToPhones(text);
    out.push(...schedulePhones(phones, start, end));
  }
  return out;
}

/**
 * Estimate from plain text + optional total duration.
 * @param {string} text
 * @param {{ durationSec?: number, wps?: number }} [opts]
 */
export function estimatePhonemesFromText(text, opts = {}) {
  const raw = String(text || '').trim();
  if (!raw) return [];
  const words = raw.split(/\s+/).filter(Boolean);
  const wps = opts.wps ?? 2.4;
  const total =
    opts.durationSec && opts.durationSec > 0
      ? opts.durationSec
      : Math.max(0.35, words.length / wps);

  // weight by phone count
  const phoneLists = words.map(wordToPhones);
  const weights = phoneLists.map((p) => p.length);
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1;

  /** @type {object[]} */
  const out = [];
  let t = 0;
  for (let i = 0; i < words.length; i++) {
    const share = (weights[i] / weightSum) * total * 0.92;
    const start = t;
    const end = t + share;
    out.push(...schedulePhones(phoneLists[i], start, end));
    t = end;
    // inter-word silence
    if (i < words.length - 1) {
      const gap = (total * 0.08) / Math.max(1, words.length - 1);
      out.push({ phoneme: 'sil', start: t, end: t + gap });
      t += gap;
    }
  }
  return out;
}
