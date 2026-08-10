import visemeData from '../../data/visemes/preston-blair-10.json';

const VISEME_TABLE = visemeData.visemes;

/** Normalize aliases (WQ → U). */
export function normalizeVisemeKey(key) {
  const k = String(key || 'REST').toUpperCase();
  if (k === 'WQ' || k === 'UW') return 'U';
  if (k === 'A') return 'AI';
  if (VISEME_TABLE[k]) return k;
  return 'CONS';
}

/**
 * Simplified text→viseme mapper (MVP). Product TTS should supply phoneme timestamps.
 * @param {string} char
 * @returns {string} viseme key
 */
export function charToViseme(char) {
  if (!char || !String(char).trim()) return 'REST';
  const c = String(char)[0].toLowerCase();

  if (/[\s.,!?;:'"-]/.test(c)) return 'REST';
  if ('mbp'.includes(c)) return 'MBP';
  if ('fv'.includes(c)) return 'FV';
  if (c === 'l') return 'L';
  if ('aáàâä'.includes(c)) return 'AI';
  if ('eéèêë'.includes(c)) return 'E';
  if ('iíìîïy'.includes(c)) return 'AI'; // narrow A/I stand-in
  if ('oóòôö'.includes(c)) return 'O';
  if ('uúùûüw'.includes(c)) return 'U';
  if (/[a-z]/.test(c)) return 'CONS';
  return 'REST';
}

/**
 * Map a text string to a viseme sequence (one per character, MVP discrete).
 * @param {string} text
 * @returns {{ char: string, viseme: string }[]}
 */
export function textToVisemeSequence(text) {
  return [...String(text)].map((char) => ({
    char,
    viseme: charToViseme(char),
  }));
}

export function getVisemeRule(visemeKey) {
  const key = normalizeVisemeKey(visemeKey);
  const rule = VISEME_TABLE[key];
  if (!rule) throw new Error(`Unknown viseme: ${visemeKey}`);
  return { key, rule };
}

export { VISEME_TABLE };
