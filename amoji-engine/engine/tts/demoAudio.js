/**
 * Build a short mono WAV (soft timing tone) for SpeechPlayer audio-sync demos.
 * Not speech — only a clock reference matching phoneme duration.
 * @param {number} durationSec
 * @param {{ sampleRate?: number, freq?: number }} [opts]
 * @returns {Blob}
 */
export function synthesizeTimingToneWav(durationSec, opts = {}) {
  const sampleRate = opts.sampleRate ?? 22050;
  const freq = opts.freq ?? 220;
  const dur = Math.max(0.05, Math.min(30, durationSec || 0.5));
  const n = Math.floor(dur * sampleRate);
  const dataSize = n * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    // Soft carrier with slow AM so sync is audible without being harsh
    const env = 0.15 + 0.1 * Math.sin(t * Math.PI * 2 * 2.5);
    const attack = Math.min(1, t / 0.03);
    const release = Math.min(1, (dur - t) / 0.05);
    const sample = Math.sin(t * Math.PI * 2 * freq) * env * attack * release;
    const s = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * 2, (s * 0.35 * 32767) | 0, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * @param {number} durationSec
 * @returns {string} object URL (caller should revoke)
 */
export function timingToneObjectUrl(durationSec) {
  if (typeof URL === 'undefined' || !URL.createObjectURL) {
    throw new Error('URL.createObjectURL unavailable');
  }
  return URL.createObjectURL(synthesizeTimingToneWav(durationSec));
}
