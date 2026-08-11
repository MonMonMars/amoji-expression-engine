/**
 * Face Live UI prefs — session persistence via localStorage (browser) or memory (Node).
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import {
  matchDisneyExtremeHotkey,
  isDisneyExtremeNudgeHotkeyKey,
  disneyExtremeHistoryJumpIndex,
  disneyExtremeFavoriteJumpIndex,
  buildDisneyExtremeLiveSnapshot,
  DISNEY_EXTREME_EASE_OVERDRIVE_GAIN,
  isDisneyExtremeSnapshotDirty,
  disneyExtremeSnapshotFingerprintShort,
} from '../layers/emotionMorphs.js';

export const FACE_LIVE_PREFS_KEY = 'amoji.faceLive.prefs.v1';
export const FACE_LIVE_PREFS_VERSION = 1;

/** @type {Record<string, any>|null} */
let memoryStore = null;

/**
 * Default prefs snapshot.
 */
export function defaultFaceLivePrefs() {
  return {
    version: FACE_LIVE_PREFS_VERSION,
    emotion: 'happy',
    intensity: 0.7,
    // Disney Extreme — separate shape multipliers + optional body/head deform.
    disneyExtreme: false,
    disneyExtremeFactor: 1.6,
    disneyExtremeBody: true,
    disneyExtremeBodyFactor: 1.6,
    disneyExtremeEyeFactor: 1.4,
    disneyExtremeMouthFactor: 1.5,
    personaId: 'companion',
    chassisId: 'desktop-buddy',
    robotPackId: 'face-servo-12',
    fingerPresetId: 'rest',
    liveLinkRemapId: 'identity',
    ttsPresetId: 'mock',
    ttsEndpoint: '',
    fingerEmblemSyncOn: true,
    audioSync: true,
    surfaceLevel: 6,
    probeToastSoundMuted: false,
    probeToastHapticMuted: false,
    probeToastLinkMute: true,
    probeToastVolume: 1,
  };
}

/**
 * Factory defaults for Disney Extreme × factors / body apply (master toggle excluded).
 */
export function disneyExtremeUiDefaults() {
  const d = defaultFaceLivePrefs();
  return {
    disneyExtremeFactor: d.disneyExtremeFactor,
    disneyExtremeBody: d.disneyExtremeBody,
    disneyExtremeBodyFactor: d.disneyExtremeBodyFactor,
    disneyExtremeEyeFactor: d.disneyExtremeEyeFactor,
    disneyExtremeMouthFactor: d.disneyExtremeMouthFactor,
  };
}

/**
 * Resolve Face Live Disney Extreme hotkey.
 * - `x` / `X` → toggle master
 * - `Shift+X` → enable Extreme (force on)
 * - `Alt+X` → focus / scroll Extreme panel into view
 * - `Shift+Alt+X` → enable Extreme and focus panel
 * - `b` / `B` → toggle Apply to body/head (enables Extreme if needed)
 * - `Shift+B` → enable Apply to body/head (force on; enables Extreme if needed)
 * - `Alt+B` → paste Extreme baseline stacks share URL (`#dxb=`)
 * - `Shift+Alt+B` → merge Extreme baseline stacks share URL into stacks
 * - `r` / `R` → reset × defaults
 * - `Shift+R` → reset × defaults then flash all-params bundle
 * - `Alt+R` → jump / restore Extreme pinned baseline
 * - `Shift+Alt+R` → jump Extreme pin then flash pin summary
 * - `h` / `H` / `?` → flash hotkey help on status
 * - `Alt+H` → copy Extreme hotkey help legend
 * - `Shift+H` → copy Extreme baseline history list text to clipboard
 * - `Shift+Alt+H` → copy Extreme baseline redo list text to clipboard
 * - `e` / `E` → flash ease curve label on status
 * - `Shift+E` → copy ease curve SVG to clipboard
 * - `Alt+E` → copy ease curve label text to clipboard
 * - `Shift+Alt+E` → copy ease curve label + SVG bundle to clipboard
 * - `m` / `M` → flash body mix label on status
 * - `Shift+M` → copy body mix SVG to clipboard
 * - `Alt+M` → copy body mix label text to clipboard
 * - `Shift+Alt+M` → copy body mix label + SVG bundle to clipboard
 * - `f` / `F` → flash factor bars label on status
 * - `Shift+F` → copy factor bars SVG to clipboard
 * - `Alt+F` → paste Extreme baseline favorites share URL (`#dxf=`)
 * - `Shift+Alt+F` → merge Extreme baseline favorites share URL into favorites
 * - `n` / `N` → flash neck blend / body mix label on status
 * - `Alt+N` → copy neck blend label text to clipboard
 * - `Shift+N` → copy factor bars label text to clipboard
 * - `Shift+Alt+N` → copy neck + factors labels bundle to clipboard
 * - `a` / `A` → flash combined Extreme bundle readout
 * - `Shift+A` → copy Extreme bundle text to clipboard
 * - `Alt+A` → flash Extreme pin bundle readout
 * - `Shift+Alt+A` → copy Extreme pin bundle text to clipboard
 * - `j` / `J` → copy Extreme snapshot JSON to clipboard
 * - `Shift+J` → paste / apply Extreme snapshot JSON from clipboard
 * - `Alt+J` → paste Extreme snapshot share URL (`#dxs=`)
 * - `Shift+Alt+J` → paste Extreme snapshot share URL apply-live only (keep pin)
 * - `d` / `D` → flash Extreme snapshot diff vs last copy/paste baseline
 * - `Shift+D` → restore Extreme factors from last copy/paste baseline
 * - `Alt+D` → flash Extreme pinned baseline summary
 * - `Shift+Alt+D` → copy Extreme pinned baseline summary text to clipboard
 * - `k` / `K` → clear Extreme snapshot baseline (dirty tracking off)
 * - `Shift+K` → clear Extreme baseline history + redo stacks (keep baseline)
 * - `w` / `W` → wipe Extreme baseline redo stack only (keep hist + baseline)
 * - `Shift+W` → wipe Extreme baseline favorites only
 * - `p` / `P` → pin current Extreme factors as baseline
 * - `o` / `O` → copy Extreme baseline redo JSON
 * - `Shift+O` → paste Extreme baseline redo JSON from clipboard
 * - `Alt+O` → merge Extreme baseline redo JSON into current redo stack
 * - `u` / `U` → undo Extreme baseline to previous history entry
 * - `Shift+U` → redo Extreme baseline from redo stack
 * - `Alt+U` → cycle next Extreme redo entry
 * - `Shift+Alt+U` → cycle previous Extreme redo entry
 * - `y` / `Y` → copy Extreme snapshot share link (`#dxs=`)
 * - `Shift+Y` → copy Extreme baseline history share link (`#dxh=`)
 * - `Alt+Y` → copy Extreme baseline redo share link (`#dxr=`)
 * - `k` / `K` → clear Extreme baseline (and hist/redo)
 * - `Shift+K` → clear Extreme baseline history (+ wipe redo)
 * - `Alt+K` → clear Extreme baseline pin only (keep stacks)
 * - `Shift+Alt+K` → clear Extreme baseline history only (keep redo)
 * - `w` / `W` → wipe Extreme baseline redo stack
 * - `Shift+W` → wipe Extreme baseline favorites
 * - `Alt+W` → wipe Extreme baseline stacks (hist + redo + fav)
 * - `Shift+Alt+W` → wipe Extreme stacks and clear pin (all)
 * - `p` / `P` → pin current Extreme factors as baseline
 * - `Shift+P` → replace Extreme pin in place (no hist push / redo wipe)
 * - `Alt+P` → copy Extreme live fingerprint
 * - `Shift+Alt+P` → copy Extreme pinned baseline fingerprint
 * - `o` / `O` → copy Extreme baseline redo JSON
 * - `Shift+O` → paste Extreme baseline redo JSON from clipboard
 * - `Alt+O` → merge Extreme baseline redo JSON into current redo stack
 * - `Shift+Alt+O` → merge Extreme baseline redo share URL into redo
 * - `u` / `U` → undo Extreme baseline to previous history entry
 * - `Shift+U` → redo Extreme baseline from redo stack
 * - `Alt+U` → cycle next Extreme redo entry
 * - `Shift+Alt+U` → cycle previous Extreme redo entry
 * - `y` / `Y` → copy Extreme snapshot share link (`#dxs=`)
 * - `Shift+Y` → copy Extreme baseline history share link (`#dxh=`)
 * - `Alt+Y` → copy Extreme baseline redo share link (`#dxr=`)
 * - `Shift+Alt+Y` → paste Extreme baseline redo share URL (`#dxr=`)
 * - `s` / `S` → star current Extreme factors into favorites
 * - `Shift+S` → flash Extreme favorites list
 * - `Alt+S` → unstar matching Extreme favorite
 * - `Shift+Alt+S` → copy Extreme favorites list text to clipboard
 * - `g` / `G` → copy Extreme baseline favorites JSON
 * - `Shift+G` → paste Extreme baseline favorites JSON from clipboard
 * - `Alt+G` → merge Extreme baseline favorites JSON into current favorites
 * - `Shift+Alt+G` → copy Extreme favorites list + JSON bundle to clipboard
 * - `t` / `T` → copy Extreme baseline favorites share link (`#dxf=`)
 * - `Alt+T` → toggle Extreme More IO panel
 * - `Shift+T` → toggle Extreme More IO panel
 * - `Shift+Alt+T` → open Extreme More IO panel
 * - `z` / `Z` → copy Extreme baseline stacks JSON (hist + redo + fav)
 * - `Shift+Z` → paste Extreme baseline stacks JSON from clipboard
 * - `Alt+Z` → merge Extreme baseline stacks JSON into current stacks
 * - `Shift+Alt+Z` → copy Extreme stacks summary + JSON bundle to clipboard
 * - `v` / `V` → copy Extreme baseline stacks share link (`#dxb=`)
 * - `Shift+V` → copy Extreme kit share link (`#dxs=` + `#dxb=`)
 * - `Alt+V` → paste Extreme kit share URL from clipboard
 * - `Shift+Alt+V` → merge Extreme kit share URL into stacks (+ apply snap)
 * - `q` / `Q` → cycle next Extreme favorite
 * - `Shift+Q` → cycle previous Extreme favorite
 * - `Alt+Q` → cycle next Extreme history entry
 * - `Shift+Alt+Q` → cycle previous Extreme history entry
 * - `l` / `L` → flash Extreme baseline history list
 * - `Shift+L` → copy Extreme baseline history JSON
 * - `Alt+L` → flash Extreme baseline stacks summary
 * - `Shift+Alt+L` → copy Extreme baseline stacks summary
 * - `` ` `` → flash Extreme baseline stacks capacity (n/limit)
 * - `~` / Shift+`` ` `` → copy Extreme baseline stacks capacity
 * - `\\` → flash Extreme root (oldest) hist/redo/fav readout (no apply)
 * - `|` / Shift+`\\` → copy Extreme root hist/redo/fav readout
 * - `i` / `I` → paste Extreme baseline history JSON from clipboard
 * - `Shift+I` → merge Extreme baseline history JSON into current stack
 * - `Alt+I` → paste Extreme baseline history share URL (`#dxh=`)
 * - `Shift+Alt+I` → merge Extreme baseline history share URL into history
 * - `1`–`8` → jump to Extreme baseline history entry by index
 * - `Shift+1`–`8` → jump to Extreme baseline redo entry by index
 * - `Alt+1`–`8` → jump to Extreme favorite by index
 * - `Shift+Alt+1`–`8` → jump Extreme favorite then flash entry summary
 * - `9` → jump to latest Extreme baseline history entry
 * - `Shift+9` → jump to latest Extreme baseline redo entry
 * - `Alt+9` → jump latest history then flash entry summary
 * - `Shift+Alt+9` → jump latest redo then flash entry summary
 * - `0` → jump to latest Extreme favorite
 * - `Shift+0` → jump latest favorite then flash entry summary
 * - `Alt+0` → flash tip hist/redo/fav readout (no apply)
 * - `Shift+Alt+0` → copy tip hist/redo/fav readout to clipboard
 * - `/` → jump to oldest Extreme baseline history entry
 * - `Alt+/` → jump to oldest Extreme baseline redo entry
 * - `Shift+Alt+/` → jump to oldest Extreme favorite
 * - `Space` → jump oldest history then flash entry summary
 * - `Shift+Space` → jump oldest redo then flash entry summary
 * - `Alt+Space` → jump oldest favorite then flash entry summary
 * - `Shift+Alt+Space` → flash active hist/redo/fav chip indices
 * - `Enter` → copy active hist/redo/fav chip indices
 * - `Shift+Enter` → flash Extreme pin strip readout
 * - `Alt+Enter` → flash Extreme HUD bundle summary
 * - `Shift+Alt+Enter` → copy Extreme HUD bundle (tips/roots/capacity/active/pin)
 * - `Home` → flash Extreme dirty/clean pin-drift strip
 * - `End` → copy Extreme dirty/clean pin-drift strip
 * - `PageUp` → toggle Extreme strips panel
 * - `Shift+PageUp` → open Extreme strips panel
 * - `PageDown` → flash Extreme strips summary
 * - `Shift+PageDown` → copy Extreme strips summary
 * - `ArrowDown` / `ArrowUp` → cycle Extreme history next / previous
 * - `Shift+ArrowDown` / `Shift+ArrowUp` → cycle Extreme redo next / previous
 * - `ArrowRight` / `ArrowLeft` → cycle Extreme favorite next / previous
 * - `Delete` / `Backspace` → clear Extreme active chips / status hold
 * - `Insert` → pin current Extreme factors as baseline
 * - `Shift+Insert` → replace Extreme pinned baseline
 * - `Alt+Insert` → jump / restore Extreme pinned baseline
 * - `Shift+Alt+Insert` → jump Extreme pin then flash pin summary
 * - `Tab` → focus / scroll Extreme panel into view (Shift+Tab left to browser)
 * - `F2` → flash Extreme factors strip
 * - `Shift+F2` → copy Extreme factors strip
 * - `F3` → flash Extreme ease strip
 * - `Shift+F3` → copy Extreme ease strip
 * - `F4` → flash Extreme mix strip
 * - `Shift+F4` → copy Extreme mix strip
 * - `F5` → flash Extreme neck strip
 * - `Shift+F5` → copy Extreme neck strip
 * - `F6` → flash Extreme tips strip
 * - `Shift+F6` → copy Extreme tips strip
 * - `F7` → flash Extreme capacity strip
 * - `Shift+F7` → copy Extreme capacity strip
 * - `F8` → flash Extreme roots strip
 * - `Shift+F8` → copy Extreme roots strip
 * - `F9` → flash Extreme active strip
 * - `Shift+F9` → copy Extreme active strip
 * - `F10` → flash Extreme pin strip
 * - `Shift+F10` → copy Extreme pin strip
 * - `F11` → flash Extreme dirty strip
 * - `Shift+F11` → copy Extreme dirty strip
 * - `Escape` → clear sticky status flash (and chip compare / active chips when set)
 * - `c` / `C` → copy Extreme prefs summary
 * - `Shift+C` → copy Extreme snapshot diff vs baseline
 * - `Alt+C` → copy Extreme pinned baseline share link (`#dxs=`)
 * - `Shift+Alt+C` → paste Extreme pin share URL as pin only (keep live factors)
 * - `r` / `R` → reset × defaults
 * - `Shift+R` → reset × defaults then flash all-params bundle
 * - `Alt+R` → jump / restore Extreme pinned baseline
 * - `Shift+Alt+R` → jump Extreme pin then flash pin summary
 * - `[` / `]` → nudge shape × (when Extreme is on; Shift = coarse 0.10; Alt = coarser 0.20)
 * - `-` / `=` → nudge body × (when Extreme is on; enables body apply if needed; Shift/Alt step)
 * - `,` / `.` → nudge eyes × (when Extreme is on; Shift/`</>` = coarse; Alt = coarser)
 * - `;` / `'` → nudge mouth × (when Extreme is on; Shift/Alt step)
 * Ignores when typing in form fields or with modifier keys (Escape exempt when holding or chip compare / active chips is set; Shift/Alt allowed for nudge steps; Alt+O merge redo / Alt+Y share redo / Alt+G merge fav / ⇧Alt+G copy fav+json / Alt+Z merge stacks / ⇧Alt+Z copy stacks+json / Alt+S unstar fav / ⇧Alt+S copy fav list / Alt+W wipe stacks / ⇧Alt+W wipe all / Alt+P copy fp / ⇧Alt+P pin fp / Alt+K clear pin / ⇧Alt+K clear hist keep redo / Alt+L stacks / Alt+V paste kit / Alt+T/Shift+T more IO / ⇧Alt+T open more IO / Alt+H copy help / Shift+H copy hist list / ⇧Alt+H copy redo list / Alt+Q hist cycle / Alt+U redo cycle / Alt+R jump pin / ⇧Alt+R jump pin summary / Shift+R reset+all / Alt+B paste stacks / Alt+F paste fav / Alt+I paste hist share / Alt+J paste snap / ⇧Alt+J paste snap live / Alt+C share pin / ⇧Alt+C paste pin / Alt+D pin summary / ⇧Alt+D copy pin / Alt+X focus panel / ⇧Alt+X enable+focus / Alt+A pin bundle / ⇧Alt+A copy pin bundle / Alt+E/M/N copy labels / ⇧Alt+E/M copy label+svg / ⇧Alt+N copy neck+factors / Shift+N factors label / Shift+P replace pin / Shift+X enable / Shift+B enable body / Alt+1–8 fav jump / ⇧Alt+1–8 fav jump summary / Alt+9 hist tip summary / ⇧Alt+9 redo tip summary / Alt+0 tips readout / ⇧Alt+0 copy tips / Shift+0 fav tip summary exempt).
 * @param {KeyboardEvent|{ key?: string, metaKey?: boolean, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, target?: any, defaultPrevented?: boolean }} ev
 * @param {{ typing?: boolean, targetTag?: string, holdingStatus?: boolean, holdingChipCompare?: boolean, holdingActiveChips?: boolean }} [opts]
 * @returns {{ ok: boolean, action?: string, delta?: number, index?: number, reason?: string }}
 */
export const DISNEY_EXTREME_FACTOR_STEP = 0.05;
export const DISNEY_EXTREME_FACTOR_COARSE_MULT = 2;
/** Alt nudge multiplier (0.20 steps). Takes precedence over Shift. */
export const DISNEY_EXTREME_FACTOR_COARSER_MULT = 4;
export const DISNEY_EXTREME_SHAPE_FACTOR_STEP = DISNEY_EXTREME_FACTOR_STEP;
export const DISNEY_EXTREME_SHAPE_FACTOR_MIN = 1;
export const DISNEY_EXTREME_SHAPE_FACTOR_MAX = 1.8;
export const DISNEY_EXTREME_BODY_FACTOR_MIN = 1;
export const DISNEY_EXTREME_BODY_FACTOR_MAX = 1.8;
export const DISNEY_EXTREME_EYE_FACTOR_MIN = 1;
export const DISNEY_EXTREME_EYE_FACTOR_MAX = 2.2;
export const DISNEY_EXTREME_MOUTH_FACTOR_MIN = 1;
export const DISNEY_EXTREME_MOUTH_FACTOR_MAX = 2.2;
/** Delay before held nudge keys start repeating. */
export const DISNEY_EXTREME_NUDGE_REPEAT_INITIAL_MS = 320;
/** Interval between held nudge repeats. */
export const DISNEY_EXTREME_NUDGE_REPEAT_INTERVAL_MS = 55;

/**
 * Nudge step size — Shift ×2 (0.10), Alt ×4 (0.20; wins over Shift).
 * @param {boolean|{ shiftKey?: boolean, altKey?: boolean }} [shiftOrOpts]
 * @param {boolean} [altKey]
 * @returns {number}
 */
export function disneyExtremeNudgeStep(shiftOrOpts = false, altKey = false) {
  let shift = false;
  let alt = false;
  if (typeof shiftOrOpts === 'object' && shiftOrOpts) {
    shift = !!shiftOrOpts.shiftKey;
    alt = !!shiftOrOpts.altKey;
  } else {
    shift = !!shiftOrOpts;
    alt = !!altKey;
  }
  if (alt) return DISNEY_EXTREME_FACTOR_STEP * DISNEY_EXTREME_FACTOR_COARSER_MULT;
  if (shift) return DISNEY_EXTREME_FACTOR_STEP * DISNEY_EXTREME_FACTOR_COARSE_MULT;
  return DISNEY_EXTREME_FACTOR_STEP;
}

/**
 * @param {string|undefined} action
 * @returns {boolean}
 */
export function isDisneyExtremeNudgeAction(action) {
  return typeof action === 'string' && action.startsWith('nudge');
}

/**
 * Gate auto-repeat for Extreme factor nudge hotkeys.
 * First keydown always fires; repeats wait for initial delay then interval.
 * @param {{
 *   isRepeat?: boolean,
 *   startedMs?: number,
 *   lastFireMs?: number,
 *   nowMs?: number,
 *   initialMs?: number,
 *   intervalMs?: number,
 * }} [opts]
 * @returns {boolean}
 */
export function shouldRepeatDisneyExtremeNudge(opts = {}) {
  if (!opts.isRepeat) return true;
  const now = typeof opts.nowMs === 'number' ? opts.nowMs : 0;
  const started = typeof opts.startedMs === 'number' ? opts.startedMs : now;
  const last = typeof opts.lastFireMs === 'number' ? opts.lastFireMs : started;
  const initial =
    typeof opts.initialMs === 'number' && opts.initialMs >= 0
      ? opts.initialMs
      : DISNEY_EXTREME_NUDGE_REPEAT_INITIAL_MS;
  const interval =
    typeof opts.intervalMs === 'number' && opts.intervalMs > 0
      ? opts.intervalMs
      : DISNEY_EXTREME_NUDGE_REPEAT_INTERVAL_MS;
  if (now - started < initial) return false;
  return now - last >= interval;
}

/** Short status flash while hold-nudging factors. */
export const DISNEY_EXTREME_NUDGE_FLASH_MS = 700;

/**
 * Status copy for a factor nudge flash.
 * Optional `delta` appends · Δstep when non-default (Shift/Alt coarse).
 * @param {string} action
 * @param {number|string} value
 * @param {{ delta?: number }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeNudgeFlash(action, value, opts = {}) {
  const v = typeof value === 'number' ? value : Number(value);
  const shown = Number.isFinite(v) ? v.toFixed(2) : '—';
  const a = String(action || '');
  let label = `× ${shown}`;
  if (a.includes('Shape')) label = `shape × ${shown}`;
  else if (a.includes('Body')) label = `body × ${shown}`;
  else if (a.includes('Eye')) label = `eye × ${shown}`;
  else if (a.includes('Mouth')) label = `mouth × ${shown}`;
  const absDelta =
    typeof opts.delta === 'number' && Number.isFinite(opts.delta)
      ? Math.abs(opts.delta)
      : null;
  if (
    absDelta != null &&
    absDelta > DISNEY_EXTREME_FACTOR_STEP + 1e-9
  ) {
    return `${label} · Δ${absDelta.toFixed(2)}`;
  }
  return label;
}

/**
 * Nudge / clamp a Disney Extreme factor slider value.
 * @param {number} current
 * @param {number} [delta]
 * @param {{ min?: number, max?: number, fallback?: number, step?: number }} [range]
 * @returns {number}
 */
export function nudgeDisneyExtremeFactor(current, delta = DISNEY_EXTREME_FACTOR_STEP, range = {}) {
  const step =
    typeof range.step === 'number' && range.step > 0
      ? range.step
      : DISNEY_EXTREME_FACTOR_STEP;
  const min = typeof range.min === 'number' ? range.min : DISNEY_EXTREME_SHAPE_FACTOR_MIN;
  const max = typeof range.max === 'number' ? range.max : DISNEY_EXTREME_SHAPE_FACTOR_MAX;
  const fallback =
    typeof range.fallback === 'number' ? range.fallback : defaultFaceLivePrefs().disneyExtremeFactor;
  const d =
    typeof delta === 'number' && Number.isFinite(delta) ? delta : step;
  const raw =
    typeof current === 'number' && Number.isFinite(current) ? current : fallback;
  const next = Math.round((raw + d) / step) * step;
  return Math.max(min, Math.min(max, Number(next.toFixed(2))));
}

/**
 * Nudge / clamp Disney Extreme shape factor (slider range 1..1.8, step 0.05).
 * @param {number} current
 * @param {number} [delta]
 * @returns {number}
 */
export function nudgeDisneyExtremeShapeFactor(current, delta = DISNEY_EXTREME_FACTOR_STEP) {
  return nudgeDisneyExtremeFactor(current, delta, {
    min: DISNEY_EXTREME_SHAPE_FACTOR_MIN,
    max: DISNEY_EXTREME_SHAPE_FACTOR_MAX,
    fallback: defaultFaceLivePrefs().disneyExtremeFactor,
  });
}

/**
 * Nudge / clamp Disney Extreme body factor (1..1.8).
 * @param {number} current
 * @param {number} [delta]
 */
export function nudgeDisneyExtremeBodyFactor(current, delta = DISNEY_EXTREME_FACTOR_STEP) {
  return nudgeDisneyExtremeFactor(current, delta, {
    min: DISNEY_EXTREME_BODY_FACTOR_MIN,
    max: DISNEY_EXTREME_BODY_FACTOR_MAX,
    fallback: defaultFaceLivePrefs().disneyExtremeBodyFactor,
  });
}

/**
 * Nudge / clamp Disney Extreme eye factor (1..2.2).
 * @param {number} current
 * @param {number} [delta]
 */
export function nudgeDisneyExtremeEyeFactor(current, delta = DISNEY_EXTREME_FACTOR_STEP) {
  return nudgeDisneyExtremeFactor(current, delta, {
    min: DISNEY_EXTREME_EYE_FACTOR_MIN,
    max: DISNEY_EXTREME_EYE_FACTOR_MAX,
    fallback: defaultFaceLivePrefs().disneyExtremeEyeFactor,
  });
}

/**
 * Nudge / clamp Disney Extreme mouth factor (1..2.2).
 * @param {number} current
 * @param {number} [delta]
 */
export function nudgeDisneyExtremeMouthFactor(current, delta = DISNEY_EXTREME_FACTOR_STEP) {
  return nudgeDisneyExtremeFactor(current, delta, {
    min: DISNEY_EXTREME_MOUTH_FACTOR_MIN,
    max: DISNEY_EXTREME_MOUTH_FACTOR_MAX,
    fallback: defaultFaceLivePrefs().disneyExtremeMouthFactor,
  });
}

export function resolveDisneyExtremeHotkey(ev, opts = {}) {
  if (!ev || ev.defaultPrevented) return { ok: false, reason: 'none' };
  if (ev.metaKey || ev.ctrlKey) return { ok: false, reason: 'modifier' };
  const key = String(ev.key || '');
  if (key === 'Escape') {
    if (
      opts.holdingStatus ||
      opts.holdingChipCompare ||
      opts.holdingActiveChips
    ) {
      return { ok: true, action: 'clearStatusHold' };
    }
    return { ok: false, reason: 'no_hold' };
  }
  const tag = String(opts.targetTag || ev.target?.tagName || '').toUpperCase();
  const typing =
    opts.typing === true ||
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    !!ev.target?.isContentEditable;
  if (typing) return { ok: false, reason: 'typing' };
  // Alt is reserved for coarser factor nudges — reject on letter/action hotkeys
  // except ... / Alt+Enter hud bundle / Alt+Insert jump pin (⇧Alt+Insert summary).
  if (ev.altKey && !isDisneyExtremeNudgeHotkeyKey(key)) {
    const lower = key.toLowerCase();
    const favJumpDigit = /^[1-8]$/.test(lower);
    const tipDigit = lower === '9' || lower === '0';
    const rootSlash = lower === '/';
    const rootSpace = key === ' ';
    const enterKey = key === 'Enter';
    const insertKey = key === 'Insert';
    if (
      lower !== 'o' &&
      lower !== 'y' &&
      lower !== 'g' &&
      lower !== 'z' &&
      lower !== 's' &&
      lower !== 'w' &&
      lower !== 'p' &&
      lower !== 'k' &&
      lower !== 'l' &&
      lower !== 'v' &&
      lower !== 't' &&
      lower !== 'h' &&
      lower !== 'q' &&
      lower !== 'u' &&
      lower !== 'r' &&
      lower !== 'b' &&
      lower !== 'f' &&
      lower !== 'i' &&
      lower !== 'j' &&
      lower !== 'c' &&
      lower !== 'd' &&
      lower !== 'x' &&
      lower !== 'a' &&
      lower !== 'e' &&
      lower !== 'm' &&
      lower !== 'n' &&
      !favJumpDigit &&
      !tipDigit &&
      !rootSlash &&
      !rootSpace &&
      !enterKey &&
      !insertKey
    ) {
      return { ok: false, reason: 'modifier' };
    }
  }
  const matched = matchDisneyExtremeHotkey(key);
  if (!matched) return { ok: false, reason: 'key' };
  const { entry, dir } = matched;
  if (entry.kind === 'escape') {
    return { ok: false, reason: 'no_hold' };
  }
  if (entry.kind === 'action') {
    if (entry.id === 'showHelp' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineRedoList' };
    }
    if (entry.id === 'showHelp' && ev.altKey) {
      return { ok: true, action: 'copyHotkeyHelp' };
    }
    if (entry.id === 'showHelp' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineHistoryList' };
    }
    if (entry.id === 'showEaseCurve' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'copyEaseCurveBundle' };
    }
    if (entry.id === 'showEaseCurve' && ev.altKey) {
      return { ok: true, action: 'copyEaseCurveLabel' };
    }
    if (entry.id === 'showEaseCurve' && ev.shiftKey) {
      return { ok: true, action: 'copyEaseCurve' };
    }
    if (entry.id === 'showBodyMix' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'copyBodyMixBundle' };
    }
    if (entry.id === 'showBodyMix' && ev.altKey) {
      return { ok: true, action: 'copyBodyMixLabel' };
    }
    if (entry.id === 'showBodyMix' && ev.shiftKey) {
      return { ok: true, action: 'copyBodyMixCurve' };
    }
    if (entry.id === 'showFactorBars' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'mergeBaselineFavoritesShareUrl' };
    }
    if (entry.id === 'showFactorBars' && ev.altKey) {
      return { ok: true, action: 'pasteBaselineFavoritesShareUrl' };
    }
    if (entry.id === 'showFactorBars' && ev.shiftKey) {
      return { ok: true, action: 'copyFactorBars' };
    }
    if (entry.id === 'showNeckBlend' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'copyNeckFactorsBundle' };
    }
    if (entry.id === 'showNeckBlend' && ev.altKey) {
      return { ok: true, action: 'copyNeckLabel' };
    }
    if (entry.id === 'showNeckBlend' && ev.shiftKey) {
      return { ok: true, action: 'copyFactorBarsLabel' };
    }
    if (entry.id === 'showBundle' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'copyBaselinePinBundle' };
    }
    if (entry.id === 'showBundle' && ev.altKey) {
      return { ok: true, action: 'showBaselinePinBundle' };
    }
    if (entry.id === 'showBundle' && ev.shiftKey) {
      return { ok: true, action: 'copyBundle' };
    }
    if (entry.id === 'copySnapshotJson' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'pasteSnapshotShareUrlLive' };
    }
    if (entry.id === 'copySnapshotJson' && ev.altKey) {
      return { ok: true, action: 'pasteSnapshotShareUrl' };
    }
    if (entry.id === 'copySnapshotJson' && ev.shiftKey) {
      return { ok: true, action: 'pasteSnapshotJson' };
    }
    if (entry.id === 'showSnapshotDiff' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'copyBaselinePin' };
    }
    if (entry.id === 'showSnapshotDiff' && ev.altKey) {
      return { ok: true, action: 'showBaselinePin' };
    }
    if (entry.id === 'showSnapshotDiff' && ev.shiftKey) {
      return { ok: true, action: 'restoreBaseline' };
    }
    if (entry.id === 'copySummary' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'pasteBaselinePinShareUrl' };
    }
    if (entry.id === 'copySummary' && ev.altKey) {
      return { ok: true, action: 'copyBaselinePinShareUrl' };
    }
    if (entry.id === 'copySummary' && ev.shiftKey) {
      return { ok: true, action: 'copySnapshotDiff' };
    }
    if (entry.id === 'toggle' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'enableFocusExtremePanel' };
    }
    if (entry.id === 'toggle' && ev.altKey) {
      return { ok: true, action: 'focusExtremePanel' };
    }
    if (entry.id === 'toggle' && ev.shiftKey) {
      return { ok: true, action: 'enableExtreme' };
    }
    if (entry.id === 'undoBaseline' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'cycleBaselineRedoPrev' };
    }
    if (entry.id === 'undoBaseline' && ev.altKey) {
      return { ok: true, action: 'cycleBaselineRedoNext' };
    }
    if (entry.id === 'undoBaseline' && ev.shiftKey) {
      return { ok: true, action: 'redoBaseline' };
    }
    if (entry.id === 'resetDefaults' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'jumpBaselinePinSummary' };
    }
    if (entry.id === 'resetDefaults' && ev.altKey) {
      return { ok: true, action: 'jumpBaselinePin' };
    }
    if (entry.id === 'resetDefaults' && ev.shiftKey) {
      return { ok: true, action: 'resetShowBundle' };
    }
    if (entry.id === 'toggleBodyApply' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'mergeBaselineStacksShareUrl' };
    }
    if (entry.id === 'toggleBodyApply' && ev.altKey) {
      return { ok: true, action: 'pasteBaselineStacksShareUrl' };
    }
    if (entry.id === 'toggleBodyApply' && ev.shiftKey) {
      return { ok: true, action: 'enableBodyApply' };
    }
    if (entry.id === 'showBaselineHistory' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineStacksSummary' };
    }
    if (entry.id === 'showBaselineHistory' && ev.altKey) {
      return { ok: true, action: 'showBaselineStacks' };
    }
    if (entry.id === 'showBaselineHistory' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineHistoryJson' };
    }
    if (
      entry.id === 'showBaselineStacksCapacity' &&
      (ev.shiftKey || key === '~')
    ) {
      return { ok: true, action: 'copyBaselineStacksCapacity' };
    }
    if (entry.id === 'showBaselineRoots' && (ev.shiftKey || key === '|')) {
      return { ok: true, action: 'copyBaselineRoots' };
    }
    if (entry.id === 'pasteBaselineHistoryJson' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'mergeBaselineHistoryShareUrl' };
    }
    if (entry.id === 'pasteBaselineHistoryJson' && ev.altKey) {
      return { ok: true, action: 'pasteBaselineHistoryShareUrl' };
    }
    if (entry.id === 'pasteBaselineHistoryJson' && ev.shiftKey) {
      return { ok: true, action: 'mergeBaselineHistoryJson' };
    }
    if (entry.id === 'clearBaseline' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'clearBaselineHistoryKeepRedo' };
    }
    if (entry.id === 'clearBaseline' && ev.altKey) {
      return { ok: true, action: 'clearBaselinePin' };
    }
    if (entry.id === 'clearBaseline' && ev.shiftKey) {
      return { ok: true, action: 'clearBaselineHistory' };
    }
    if (entry.id === 'clearBaselineRedo' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'wipeBaselineAll' };
    }
    if (entry.id === 'clearBaselineRedo' && ev.altKey) {
      return { ok: true, action: 'clearBaselineStacks' };
    }
    if (entry.id === 'clearBaselineRedo' && ev.shiftKey) {
      return { ok: true, action: 'clearBaselineFavorites' };
    }
    if (entry.id === 'pinBaseline' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'copyBaselinePinFingerprint' };
    }
    if (entry.id === 'pinBaseline' && ev.altKey) {
      return { ok: true, action: 'copySnapshotFingerprint' };
    }
    if (entry.id === 'pinBaseline' && ev.shiftKey) {
      return { ok: true, action: 'replaceBaselinePin' };
    }
    if (entry.id === 'copyBaselineRedoJson' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'mergeBaselineRedoShareUrl' };
    }
    if (entry.id === 'copyBaselineRedoJson' && ev.altKey) {
      return { ok: true, action: 'mergeBaselineRedoJson' };
    }
    if (entry.id === 'copyBaselineRedoJson' && ev.shiftKey) {
      return { ok: true, action: 'pasteBaselineRedoJson' };
    }
    if (entry.id === 'copySnapshotShareUrl' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'pasteBaselineRedoShareUrl' };
    }
    if (entry.id === 'copySnapshotShareUrl' && ev.altKey) {
      return { ok: true, action: 'copyBaselineRedoShareUrl' };
    }
    if (entry.id === 'copySnapshotShareUrl' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineHistoryShareUrl' };
    }
    if (entry.id === 'starBaselineFavorite' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineFavoritesList' };
    }
    if (entry.id === 'starBaselineFavorite' && ev.altKey) {
      return { ok: true, action: 'unstarBaselineFavorite' };
    }
    if (entry.id === 'starBaselineFavorite' && ev.shiftKey) {
      return { ok: true, action: 'showBaselineFavorites' };
    }
    if (entry.id === 'copyBaselineFavoritesJson' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineFavoritesBundle' };
    }
    if (entry.id === 'copyBaselineFavoritesJson' && ev.altKey) {
      return { ok: true, action: 'mergeBaselineFavoritesJson' };
    }
    if (entry.id === 'copyBaselineFavoritesJson' && ev.shiftKey) {
      return { ok: true, action: 'pasteBaselineFavoritesJson' };
    }
    if (entry.id === 'copyBaselineFavoritesShareUrl' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'openMoreIo' };
    }
    if (entry.id === 'copyBaselineFavoritesShareUrl' && ev.altKey) {
      return { ok: true, action: 'toggleMoreIo' };
    }
    if (entry.id === 'copyBaselineFavoritesShareUrl' && ev.shiftKey) {
      return { ok: true, action: 'toggleMoreIo' };
    }
    if (entry.id === 'copyBaselineStacksJson' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineStacksBundle' };
    }
    if (entry.id === 'copyBaselineStacksJson' && ev.altKey) {
      return { ok: true, action: 'mergeBaselineStacksJson' };
    }
    if (entry.id === 'copyBaselineStacksJson' && ev.shiftKey) {
      return { ok: true, action: 'pasteBaselineStacksJson' };
    }
    if (entry.id === 'copyBaselineStacksShareUrl' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'mergeBaselineKitShareUrl' };
    }
    if (entry.id === 'copyBaselineStacksShareUrl' && ev.altKey) {
      return { ok: true, action: 'pasteBaselineKitShareUrl' };
    }
    if (entry.id === 'copyBaselineStacksShareUrl' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineKitShareUrl' };
    }
    if (entry.id === 'cycleBaselineFavoriteNext' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'cycleBaselineHistoryPrev' };
    }
    if (entry.id === 'cycleBaselineFavoriteNext' && ev.altKey) {
      return { ok: true, action: 'cycleBaselineHistoryNext' };
    }
    if (entry.id === 'cycleBaselineFavoriteNext' && ev.shiftKey) {
      return { ok: true, action: 'cycleBaselineFavoritePrev' };
    }
    if (entry.id === 'jumpBaselineHistoryTip' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'jumpBaselineRedoTipSummary' };
    }
    if (entry.id === 'jumpBaselineHistoryTip' && ev.altKey) {
      return { ok: true, action: 'jumpBaselineHistoryTipSummary' };
    }
    if (entry.id === 'jumpBaselineHistoryTip' && ev.shiftKey) {
      return { ok: true, action: 'jumpBaselineRedoTip' };
    }
    if (entry.id === 'jumpBaselineFavoriteTip' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineTips' };
    }
    if (entry.id === 'jumpBaselineFavoriteTip' && ev.altKey) {
      return { ok: true, action: 'showBaselineTips' };
    }
    if (entry.id === 'jumpBaselineFavoriteTip' && ev.shiftKey) {
      return { ok: true, action: 'jumpBaselineFavoriteTipSummary' };
    }
    if (entry.id === 'jumpBaselineHistoryRoot' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'jumpBaselineFavoriteRoot' };
    }
    if (entry.id === 'jumpBaselineHistoryRoot' && ev.altKey) {
      return { ok: true, action: 'jumpBaselineRedoRoot' };
    }
    if (
      entry.id === 'jumpBaselineHistoryRootSummary' &&
      ev.altKey &&
      ev.shiftKey
    ) {
      return { ok: true, action: 'showBaselineActive' };
    }
    if (entry.id === 'jumpBaselineHistoryRootSummary' && ev.altKey) {
      return { ok: true, action: 'jumpBaselineFavoriteRootSummary' };
    }
    if (entry.id === 'jumpBaselineHistoryRootSummary' && ev.shiftKey) {
      return { ok: true, action: 'jumpBaselineRedoRootSummary' };
    }
    if (entry.id === 'copyBaselineActive' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineHudBundle' };
    }
    if (entry.id === 'copyBaselineActive' && ev.altKey) {
      return { ok: true, action: 'showBaselineHudBundle' };
    }
    if (entry.id === 'copyBaselineActive' && ev.shiftKey) {
      return { ok: true, action: 'showBaselinePinStrip' };
    }
    if (entry.id === 'toggleBaselineStrips' && ev.shiftKey) {
      return { ok: true, action: 'openBaselineStrips' };
    }
    if (entry.id === 'showBaselineStripsSummary' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineStripsSummary' };
    }
    if (entry.id === 'arrowCycleHistory') {
      if (ev.shiftKey) {
        return {
          ok: true,
          action:
            key === 'ArrowUp'
              ? 'cycleBaselineRedoPrev'
              : 'cycleBaselineRedoNext',
        };
      }
      return {
        ok: true,
        action:
          key === 'ArrowUp'
            ? 'cycleBaselineHistoryPrev'
            : 'cycleBaselineHistoryNext',
      };
    }
    if (entry.id === 'arrowCycleFavorite') {
      return {
        ok: true,
        action:
          key === 'ArrowLeft'
            ? 'cycleBaselineFavoritePrev'
            : 'cycleBaselineFavoriteNext',
      };
    }
    if (entry.id === 'clearActiveChipsKey') {
      return { ok: true, action: 'clearStatusHold' };
    }
    if (entry.id === 'pinBaselineInsert' && ev.altKey && ev.shiftKey) {
      return { ok: true, action: 'jumpBaselinePinSummary' };
    }
    if (entry.id === 'pinBaselineInsert' && ev.altKey) {
      return { ok: true, action: 'jumpBaselinePin' };
    }
    if (entry.id === 'pinBaselineInsert' && ev.shiftKey) {
      return { ok: true, action: 'replaceBaselinePin' };
    }
    if (entry.id === 'pinBaselineInsert') {
      return { ok: true, action: 'pinBaseline' };
    }
    if (entry.id === 'focusExtremePanelTab') {
      // Preserve Shift+Tab browser focus traversal.
      if (ev.shiftKey) return { ok: false, reason: 'modifier' };
      return { ok: true, action: 'focusExtremePanel' };
    }
    if (entry.id === 'showBaselineFactorsStrip' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineFactorsStrip' };
    }
    if (entry.id === 'showBaselineEaseStrip' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineEaseStrip' };
    }
    if (entry.id === 'showBaselineMixStrip' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineMixStrip' };
    }
    if (entry.id === 'showBaselineNeckStrip' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineNeckStrip' };
    }
    if (entry.id === 'showBaselineTipsFKey' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineTips' };
    }
    if (entry.id === 'showBaselineTipsFKey') {
      return { ok: true, action: 'showBaselineTips' };
    }
    if (entry.id === 'showBaselineCapacityFKey' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineStacksCapacity' };
    }
    if (entry.id === 'showBaselineCapacityFKey') {
      return { ok: true, action: 'showBaselineStacksCapacity' };
    }
    if (entry.id === 'showBaselineRootsFKey' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineRoots' };
    }
    if (entry.id === 'showBaselineRootsFKey') {
      return { ok: true, action: 'showBaselineRoots' };
    }
    if (entry.id === 'showBaselineActiveFKey' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineActive' };
    }
    if (entry.id === 'showBaselineActiveFKey') {
      return { ok: true, action: 'showBaselineActive' };
    }
    if (entry.id === 'showBaselinePinStripFKey' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselinePinStrip' };
    }
    if (entry.id === 'showBaselinePinStripFKey') {
      return { ok: true, action: 'showBaselinePinStrip' };
    }
    if (entry.id === 'showBaselineDirtyStripFKey' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineDirtyStrip' };
    }
    if (entry.id === 'showBaselineDirtyStripFKey') {
      return { ok: true, action: 'showBaselineDirtyStrip' };
    }
    return { ok: true, action: entry.id };
  }
  if (entry.kind === 'jump') {
    if (ev.altKey && ev.shiftKey) {
      const favIndex = disneyExtremeFavoriteJumpIndex(key);
      if (favIndex == null) return { ok: false, reason: 'key' };
      return {
        ok: true,
        action: 'jumpBaselineFavoriteSummary',
        index: favIndex,
      };
    }
    if (ev.altKey) {
      const favIndex = disneyExtremeFavoriteJumpIndex(key);
      if (favIndex == null) return { ok: false, reason: 'key' };
      return { ok: true, action: 'jumpBaselineFavorite', index: favIndex };
    }
    const index = disneyExtremeHistoryJumpIndex(key);
    if (index == null) return { ok: false, reason: 'key' };
    if (ev.shiftKey) {
      return { ok: true, action: 'jumpBaselineRedo', index };
    }
    return { ok: true, action: 'jumpBaselineHistory', index };
  }
  if (entry.kind === 'nudge') {
    const step = disneyExtremeNudgeStep({
      shiftKey: !!ev.shiftKey,
      altKey: !!ev.altKey,
    });
    const factor = String(entry.factor || 'shape');
    const cap = factor.charAt(0).toUpperCase() + factor.slice(1);
    return {
      ok: true,
      action: `nudge${cap}${dir < 0 ? 'Down' : 'Up'}`,
      delta: dir < 0 ? -step : step,
    };
  }
  return { ok: false, reason: 'key' };
}

/**
 * One-line summary of Disney Extreme prefs (for landing toast / title tooltips).
 * When on, includes od/ease; overdrive recipe; body-on also appends mix + neck.
 * Optional `opts.baseline` appends dirty/clean + short fp.
 * @param {object} [prefs]
 * @param {{ baseline?: object|null }} [opts]
 * @returns {string}
 */
export function summarizeDisneyExtremePrefs(prefs, opts = {}) {
  const p = normalizeFaceLivePrefs(prefs);
  if (!p.disneyExtreme) return 'X off';
  const snap = buildDisneyExtremeLiveSnapshot({
    enabled: true,
    intensity: p.intensity,
    shapeFactor: p.disneyExtremeFactor,
    bodyOn: p.disneyExtremeBody,
    bodyFactor: p.disneyExtremeBodyFactor,
    eyeFactor: p.disneyExtremeEyeFactor,
    mouthFactor: p.disneyExtremeMouthFactor,
  });
  const body = snap.bodyOn
    ? `body×${Number(snap.bodyFactor).toFixed(2)}`
    : 'body off';
  /** @type {string[]} */
  const parts = [
    'X on',
    `shape×${Number(snap.shapeFactor).toFixed(2)}`,
    body,
    `eye×${Number(snap.eyeFactor).toFixed(2)}`,
    `mouth×${Number(snap.mouthFactor).toFixed(2)}`,
    `od×${DISNEY_EXTREME_EASE_OVERDRIVE_GAIN.toFixed(2)}`,
    `ease ${snap.ease.toFixed(2)}`,
  ];
  if (snap.shapeInt > 1 + 1e-9) {
    parts.push(`recipe ×${snap.recipe.toFixed(2)}`);
  }
  if (snap.bodyOn) {
    parts.push(`mix ${snap.bodyMix.toFixed(2)}`);
    parts.push(`neck ${snap.neckBlend.toFixed(2)}`);
  }
  if (opts.baseline) {
    const dirty = isDisneyExtremeSnapshotDirty(snap, opts.baseline);
    const fp = disneyExtremeSnapshotFingerprintShort(opts.baseline);
    parts.push(dirty ? `dirty ${fp}` : `clean ${fp}`);
  }
  return parts.join(' · ');
}

/**
 * @param {any} raw
 */
export function normalizeFaceLivePrefs(raw) {
  const base = defaultFaceLivePrefs();
  if (!raw || typeof raw !== 'object') return base;
  return {
    ...base,
    ...raw,
    version: FACE_LIVE_PREFS_VERSION,
    intensity:
      typeof raw.intensity === 'number'
        ? Math.max(0, Math.min(2.0, raw.intensity))
        : base.intensity,
    disneyExtreme: !!raw.disneyExtreme,
    disneyExtremeFactor:
      typeof raw.disneyExtremeFactor === 'number'
        ? Math.max(1, Math.min(1.8, raw.disneyExtremeFactor))
        : base.disneyExtremeFactor,
    disneyExtremeBody: raw.disneyExtremeBody !== false,
    disneyExtremeBodyFactor:
      typeof raw.disneyExtremeBodyFactor === 'number'
        ? Math.max(1, Math.min(1.8, raw.disneyExtremeBodyFactor))
        : base.disneyExtremeBodyFactor,
    disneyExtremeEyeFactor:
      typeof raw.disneyExtremeEyeFactor === 'number'
        ? Math.max(1, Math.min(2.2, raw.disneyExtremeEyeFactor))
        : base.disneyExtremeEyeFactor,
    disneyExtremeMouthFactor:
      typeof raw.disneyExtremeMouthFactor === 'number'
        ? Math.max(1, Math.min(2.2, raw.disneyExtremeMouthFactor))
        : base.disneyExtremeMouthFactor,
    fingerEmblemSyncOn: raw.fingerEmblemSyncOn !== false,
    audioSync: raw.audioSync !== false,
    surfaceLevel: Number(raw.surfaceLevel) || base.surfaceLevel,
    probeToastSoundMuted: !!raw.probeToastSoundMuted,
    probeToastHapticMuted: !!raw.probeToastHapticMuted,
    probeToastLinkMute: raw.probeToastLinkMute !== false,
    probeToastVolume:
      typeof raw.probeToastVolume === 'number'
        ? Math.max(0, Math.min(1, raw.probeToastVolume))
        : base.probeToastVolume,
  };
}

/**
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 */
function resolveStorage(opts = {}) {
  if (opts.storage) return opts.storage;
  if (opts.memory) return null;
  if (typeof localStorage !== 'undefined') return localStorage;
  return null;
}

/**
 * Load prefs (localStorage or in-memory fallback).
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 */
export function loadFaceLivePrefs(opts = {}) {
  const storage = resolveStorage(opts);
  try {
    if (storage) {
      const raw = storage.getItem(FACE_LIVE_PREFS_KEY);
      if (raw) {
        return applyComplianceGate(
          {
            kind: 'face_live_prefs',
            source: 'localStorage',
            prefs: normalizeFaceLivePrefs(JSON.parse(raw)),
          },
          {},
        );
      }
    } else if (memoryStore) {
      return applyComplianceGate(
        {
          kind: 'face_live_prefs',
          source: 'memory',
          prefs: normalizeFaceLivePrefs(memoryStore),
        },
        {},
      );
    }
  } catch {
    /* ignore corrupt */
  }
  return applyComplianceGate(
    {
      kind: 'face_live_prefs',
      source: 'default',
      prefs: defaultFaceLivePrefs(),
    },
    {},
  );
}

/**
 * Save prefs (merge with previous).
 * @param {Partial<ReturnType<typeof defaultFaceLivePrefs>>} partial
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 */
export function saveFaceLivePrefs(partial, opts = {}) {
  const prev = loadFaceLivePrefs(opts).prefs;
  const prefs = normalizeFaceLivePrefs({ ...prev, ...partial, updatedAt: Date.now() });
  const storage = resolveStorage(opts);
  try {
    if (storage) {
      storage.setItem(FACE_LIVE_PREFS_KEY, JSON.stringify(prefs));
    } else {
      memoryStore = prefs;
    }
  } catch {
    memoryStore = prefs;
  }
  return applyComplianceGate(
    {
      kind: 'face_live_prefs_save',
      prefs,
      persisted: !!storage,
    },
    {},
  );
}

/**
 * Clear stored prefs.
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 */
export function clearFaceLivePrefs(opts = {}) {
  const storage = resolveStorage(opts);
  if (storage) storage.removeItem(FACE_LIVE_PREFS_KEY);
  memoryStore = null;
  return applyComplianceGate({ kind: 'face_live_prefs_clear', ok: true }, {});
}

/**
 * Compact prefs for URL hash (drop nullish / defaults where safe).
 * @param {object} prefs
 */
export function compactPrefsForHash(prefs) {
  const full = normalizeFaceLivePrefs(prefs);
  const base = defaultFaceLivePrefs();
  /** @type {Record<string, any>} */
  const out = {};
  for (const [k, v] of Object.entries(full)) {
    if (k === 'version' || k === 'updatedAt') continue;
    if (v === base[k]) continue;
    out[k] = v;
  }
  return out;
}

/**
 * Encode prefs → URL hash fragment (`#flp=...` base64url JSON).
 * @param {object} [prefs]
 */
export function encodePrefsHash(prefs) {
  const compact = compactPrefsForHash(prefs || defaultFaceLivePrefs());
  const json = JSON.stringify(compact);
  const b64 =
    typeof Buffer !== 'undefined'
      ? Buffer.from(json, 'utf8').toString('base64url')
      : btoa(unescape(encodeURIComponent(json)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/g, '');
  return `flp=${b64}`;
}

/**
 * Decode `#flp=...` or raw flp= payload → prefs.
 * @param {string} hashOrQuery
 */
export function decodePrefsHash(hashOrQuery) {
  if (!hashOrQuery || typeof hashOrQuery !== 'string') {
    return applyComplianceGate(
      { kind: 'face_live_prefs_hash', ok: false, error: 'empty' },
      {},
    );
  }
  let raw = hashOrQuery.replace(/^#/, '');
  const m = raw.match(/(?:^|&)?flp=([^&]+)/);
  if (m) raw = m[1];
  try {
    const pad = raw.length % 4 === 0 ? '' : '='.repeat(4 - (raw.length % 4));
    const b64 = raw.replace(/-/g, '+').replace(/_/g, '/') + pad;
    const json =
      typeof Buffer !== 'undefined'
        ? Buffer.from(b64, 'base64').toString('utf8')
        : decodeURIComponent(escape(atob(b64)));
    const obj = JSON.parse(json);
    return applyComplianceGate(
      {
        kind: 'face_live_prefs_hash',
        ok: true,
        prefs: normalizeFaceLivePrefs(obj),
      },
      {},
    );
  } catch (err) {
    return applyComplianceGate(
      {
        kind: 'face_live_prefs_hash',
        ok: false,
        error: 'decode_failed',
        message: String(err?.message || err),
      },
      {},
    );
  }
}

/**
 * Read prefs from location.hash if present.
 * @param {{ hash?: string }} [loc]
 */
export function loadFaceLivePrefsFromHash(loc = {}) {
  const hash =
    loc.hash ||
    (typeof location !== 'undefined' ? location.hash : '') ||
    '';
  if (!hash.includes('flp=')) {
    return applyComplianceGate(
      { kind: 'face_live_prefs_hash', ok: false, error: 'no_flp' },
      {},
    );
  }
  return decodePrefsHash(hash);
}

/**
 * Build share URL with prefs in hash.
 * @param {object} prefs
 * @param {{ baseUrl?: string }} [opts]
 */
export function buildPrefsShareUrl(prefs, opts = {}) {
  const base =
    opts.baseUrl ||
    (typeof location !== 'undefined'
      ? `${location.origin}${location.pathname}${location.search}`
      : '');
  const frag = encodePrefsHash(prefs);
  return applyComplianceGate(
    {
      kind: 'face_live_prefs_share',
      url: base ? `${base}#${frag}` : `#${frag}`,
      hash: frag,
    },
    {},
  );
}

/**
 * Export prefs as pretty JSON string (no secrets beyond optional endpoint).
 * @param {{ storage?: Storage|null, memory?: boolean, prefs?: object }} [opts]
 */
export function exportFaceLivePrefsJson(opts = {}) {
  const prefs = opts.prefs
    ? normalizeFaceLivePrefs(opts.prefs)
    : loadFaceLivePrefs(opts).prefs;
  const payload = {
    kind: 'amoji.faceLive.prefs',
    version: FACE_LIVE_PREFS_VERSION,
    exportedAt: new Date().toISOString(),
    prefs,
  };
  return applyComplianceGate(
    {
      kind: 'face_live_prefs_export',
      json: JSON.stringify(payload, null, 2),
      prefs,
    },
    {},
  );
}

/**
 * Import prefs from JSON string or object; optionally persist.
 * @param {string|object} input
 * @param {{ storage?: Storage|null, memory?: boolean, persist?: boolean }} [opts]
 */
export function importFaceLivePrefsJson(input, opts = {}) {
  let parsed = input;
  try {
    if (typeof input === 'string') parsed = JSON.parse(input);
  } catch (err) {
    return applyComplianceGate(
      {
        kind: 'face_live_prefs_import',
        ok: false,
        error: 'invalid_json',
        message: String(err?.message || err),
      },
      {},
    );
  }
  if (!parsed || typeof parsed !== 'object') {
    return applyComplianceGate(
      { kind: 'face_live_prefs_import', ok: false, error: 'invalid_payload' },
      {},
    );
  }
  const rawPrefs = parsed.prefs && typeof parsed.prefs === 'object' ? parsed.prefs : parsed;
  const prefs = normalizeFaceLivePrefs(rawPrefs);
  if (opts.persist !== false) {
    saveFaceLivePrefs(prefs, opts);
  }
  return applyComplianceGate(
    {
      kind: 'face_live_prefs_import',
      ok: true,
      prefs,
      persisted: opts.persist !== false,
    },
    {},
  );
}
