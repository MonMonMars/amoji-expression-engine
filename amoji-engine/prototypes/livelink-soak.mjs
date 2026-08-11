#!/usr/bin/env node
/**
 * Live Link soak CLI — push synthetic ARKit frames at target FPS.
 *
 *   npm run livelink          # terminal A
 *   npm run livelink:soak     # terminal B (default 3s @ 30fps)
 *
 * Options:
 *   --duration 5
 *   --fps 60
 *   --url http://127.0.0.1:7879/publish
 *   --memory   (no HTTP; in-process publisher only)
 */
import { soakHttp, soakPublisher } from '../engine/export/liveLinkSoak.js';

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return fallback;
}

const durationSec = Number(arg('duration', '3'));
const fps = Number(arg('fps', '30'));
const url = arg('url', 'http://127.0.0.1:7879/publish');
const memoryOnly = process.argv.includes('--memory');

const result = memoryOnly
  ? soakPublisher({ durationSec, fps })
  : await soakHttp({ durationSec, fps, url });

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exitCode = 1;
