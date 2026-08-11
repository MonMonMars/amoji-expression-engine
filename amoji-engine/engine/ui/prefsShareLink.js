/**
 * Prefs share short-link + QR helpers for Face Live.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import {
  buildPrefsShareUrl,
  compactPrefsForHash,
  encodePrefsHash,
  normalizeFaceLivePrefs,
} from './faceLivePrefs.js';
import { stampPrefsForShare, evaluatePrefsLinkExpiry } from './prefsLinkExpiry.js';

export const PREFS_SHARE_DEFAULT_PATH = '/prototypes/face-live';

/**
 * Build a relative or origin-scoped short share link (`path#flp=…`).
 * @param {object} prefs
 * @param {{
 *   baseUrl?: string,
 *   origin?: string,
 *   path?: string,
 *   now?: number,
 *   ttlMs?: number,
 *   stamp?: boolean,
 * }} [opts]
 */
export function buildPrefsShortLink(prefs, opts = {}) {
  const stamped =
    opts.stamp === false
      ? normalizeFaceLivePrefs(prefs)
      : stampPrefsForShare(prefs, { now: opts.now, ttlMs: opts.ttlMs });
  const hash = encodePrefsHash(stamped);
  const path = opts.path || PREFS_SHARE_DEFAULT_PATH;
  const origin =
    opts.origin ||
    (typeof location !== 'undefined' ? location.origin : '') ||
    '';
  const shortUrl = origin ? `${origin}${path}#${hash}` : `${path}#${hash}`;
  const full = buildPrefsShareUrl(stamped, {
    baseUrl:
      opts.baseUrl ||
      (origin ? `${origin}${path}` : path) ||
      undefined,
  });
  const compact = compactPrefsForHash(stamped);
  const expiry = evaluatePrefsLinkExpiry(stamped, {
    now: opts.now,
    ttlMs: opts.ttlMs,
  });
  return applyComplianceGate(
    {
      kind: 'face_live_prefs_short_link',
      url: full.url,
      shortUrl,
      hash,
      path,
      prefs: stamped,
      compactKeyCount: Object.keys(compact).length,
      copyText: shortUrl,
      expiryHint: expiry.hint,
      expired: expiry.expired,
    },
    {},
  );
}

/**
 * External QR image URL (api.qrserver.com) for Face Live preview.
 * Offline-safe alternative: copy short link text.
 * @param {string} payload
 * @param {{ size?: number, margin?: number }} [opts]
 */
export function buildPrefsQrImageUrl(payload, opts = {}) {
  const size = Math.max(64, Math.min(512, opts.size ?? 180));
  const margin = opts.margin ?? 8;
  const data = encodeURIComponent(String(payload || ''));
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=${margin}&data=${data}`;
  return applyComplianceGate(
    {
      kind: 'face_live_prefs_qr_image',
      url,
      size,
      payloadLength: String(payload || '').length,
    },
    {},
  );
}

/**
 * Pure SVG QR-like module grid from a FNV-1a hash of the payload.
 * Not a standards-scannable QR — visual fingerprint / placeholder when offline.
 * Prefer {@link buildPrefsQrImageUrl} for camera-scannable codes.
 * @param {string} payload
 * @param {{ modules?: number, size?: number, dark?: string, light?: string }} [opts]
 */
export function buildPrefsQrFingerprintSvg(payload, opts = {}) {
  const n = Math.max(11, Math.min(33, opts.modules ?? 21));
  const size = opts.size ?? 180;
  const dark = opts.dark || '#0b1220';
  const light = opts.light || '#f4f7fb';
  const text = String(payload || '');
  let h = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const cell = size / n;
  /** @type {string[]} */
  const rects = [];
  // finder-ish corners for visual QR affordance
  const paintFinder = (ox, oy) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        if (edge || core) {
          rects.push(
            `<rect x="${(ox + x) * cell}" y="${(oy + y) * cell}" width="${cell}" height="${cell}" fill="${dark}"/>`,
          );
        }
      }
    }
  };
  paintFinder(0, 0);
  paintFinder(n - 7, 0);
  paintFinder(0, n - 7);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder =
        (x < 8 && y < 8) ||
        (x >= n - 8 && y < 8) ||
        (x < 8 && y >= n - 8);
      if (inFinder) continue;
      // mix hash bits with position
      const bit = (h ^ Math.imul(x + 1, 374761393) ^ Math.imul(y + 1, 668265263)) >>> 0;
      if (bit & (1 << ((x * 3 + y) % 31))) {
        rects.push(
          `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${dark}"/>`,
        );
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="prefs share fingerprint"><rect width="100%" height="100%" fill="${light}"/>${rects.join('')}</svg>`;
  return applyComplianceGate(
    {
      kind: 'face_live_prefs_qr_fingerprint',
      svg,
      modules: n,
      size,
      scannable: false,
      note: 'fingerprint_not_qr',
    },
    {},
  );
}

/**
 * One-shot share bundle: short link + QR image URL + offline fingerprint SVG.
 * @param {object} prefs
 * @param {{
 *   baseUrl?: string,
 *   origin?: string,
 *   path?: string,
 *   qrSize?: number,
 * }} [opts]
 */
export function buildPrefsShareBundle(prefs, opts = {}) {
  const short = buildPrefsShortLink(prefs, opts);
  const qrPayload = short.shortUrl || short.url;
  const qrImage = buildPrefsQrImageUrl(qrPayload, { size: opts.qrSize ?? 180 });
  const fingerprint = buildPrefsQrFingerprintSvg(qrPayload, {
    size: opts.qrSize ?? 180,
  });
  return applyComplianceGate(
    {
      kind: 'face_live_prefs_share_bundle',
      url: short.url,
      shortUrl: short.shortUrl,
      hash: short.hash,
      copyText: short.copyText,
      qrImageUrl: qrImage.url,
      qrFingerprintSvg: fingerprint.svg,
      compactKeyCount: short.compactKeyCount,
      prefs: short.prefs,
      expiryHint: short.expiryHint,
      expired: short.expired,
    },
    {},
  );
}
