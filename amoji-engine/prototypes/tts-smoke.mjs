#!/usr/bin/env node
/**
 * Authenticated TTS smoke CLI
 *
 *   npm run tts:smoke
 *   AMOJI_TTS_ENDPOINT=https://… AMOJI_TTS_TOKEN=… npm run tts:smoke
 *   npm run tts:smoke -- --local
 */
import { runAuthenticatedTtsSmoke } from '../engine/tts/ttsSmoke.js';

const local = process.argv.includes('--local');
const textIdx = process.argv.indexOf('--text');
const text = textIdx >= 0 ? process.argv[textIdx + 1] : undefined;

const result = await runAuthenticatedTtsSmoke({
  useLocalEcho: local || undefined,
  text,
});

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exitCode = 1;
