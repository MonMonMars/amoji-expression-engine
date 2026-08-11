/**
 * @typedef {'happy'|'sad'|'angry'|'fear'|'surprised'|'disgust'|'thinking'|'suspicious'|'neutral'|'concerned'|'embarrassed'|'smile_open'} EmotionId
 */

/**
 * Directional delta for a facial point (character-relative).
 * Positive u = up, d = down, l = left (character's left), r = right (character's right).
 * @typedef {{ u?: number, d?: number, l?: number, r?: number }} PointDelta
 */

/**
 * Abstract facial parameter bag (presentation-agnostic).
 * @typedef {Record<string, PointDelta|number|undefined> & {
 *   valence?: number,
 *   arousal?: number,
 *   pupilLX?: number,
 *   pupilLY?: number,
 *   pupilRX?: number,
 *   pupilRY?: number,
 *   overdrive?: boolean,
 * }} EmotionParams
 */

/**
 * Layer 0 script line (AEP-compatible host input). No biometric fields allowed.
 * @typedef {{
 *   line_id?: string,
 *   text?: string,
 *   dialogue_emotion?: EmotionId | {
 *     primary: EmotionId|string,
 *     secondary?: EmotionId|string|null,
 *     intensity?: number,
 *   },
 *   mood?: string | { state: string, baseline_intensity?: number },
 *   directions?: {
 *     pause_before_ms?: number,
 *     gaze?: 'lock'|'avoid'|'idle_scan'|'camera'|'presentation',
 *     step_out_before?: boolean,
 *     emblem?: string|null,
 *     smile?: string|null,
 *   },
 *   allow_improvisation?: boolean,
 *   persona?: string,
 *   phonemes?: Array<object|Array>|null,
 *   paralinguistics?: Array<object>,
 *   intensity?: number,
 * }} ScriptLine
 */

/**
 * @typedef {{
 *   warmth: number,
 *   formality: number,
 *   expressiveness: number,
 *   playfulness: number,
 *   assertiveness: number,
 *   id?: string,
 *   label?: string,
 * }} PersonaConfig
 */

/**
 * @typedef {{
 *   kind?: string,
 *   emotion?: EmotionId|string,
 *   intensity?: number,
 *   params?: EmotionParams|null,
 *   meta?: Record<string, unknown>,
 * }} EngineOutput
 */

/**
 * @typedef {{
 *   sessionId?: string,
 *   locale?: string,
 *   isMinor?: boolean,
 * }} UserContext
 */

/**
 * @typedef {{
 *   userText?: string,
 *   sessionDuration?: number,
 *   isMinor?: boolean,
 *   userContext?: UserContext,
 * }} ComplianceContext
 */

export {};
