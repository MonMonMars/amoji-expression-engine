#!/usr/bin/env node
/**
 * YouTube / local video → trimmed clip job for expression capture (authoring).
 *
 *   npm run yt-capture -- --in ./talk.mp4 --emotion happy --start 12 --duration 6
 *   npm run yt-capture -- --url 'https://www.youtube.com/watch?v=...' --emotion sad --start 30 --duration 5
 *
 * Prep always works (yt-dlp + ffmpeg). Tracking runs in the browser batch page
 * (MediaPipe) — open the printed URL, then bake the downloaded NDJSON.
 */
import { spawn, spawnSync } from 'node:child_process';
import { mkdir, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildClipJob } from '../../engine/capture/videoIngest.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DEFAULT = join(__dirname, 'out');

function usage() {
  console.log(`Amoji yt-capture — prepare video clips for expression bake (authoring)

Options:
  --in <path>         Local video file
  --url <youtube>     Download with yt-dlp (must be installed)
  --emotion <id>      Emotion label (required)
  --start <sec>       Clip start (default 0)
  --duration <sec>    Clip length (default 8)
  --fps <n>           Target track fps hint (default 24)
  --out <dir>         Output directory
  --serve             Print Capture Studio / batch URL hints
  --help
`);
}

function parseArgs(argv) {
  /** @type {Record<string, string|boolean>} */
  const out = { out: OUT_DEFAULT, start: '0', duration: '8', fps: '24' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') out.help = true;
    else if (a === '--serve') out.serve = true;
    else if (a.startsWith('--')) {
      out[a.slice(2)] = argv[++i];
    }
  }
  return out;
}

function which(cmd) {
  const r = spawnSync('bash', ['-lc', `command -v ${cmd}`], { encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : '';
}

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts,
  });
  if (r.status !== 0) {
    throw new Error(`${cmd} failed: ${r.stderr || r.stdout || r.status}`);
  }
  return r.stdout;
}

async function downloadYoutube(url, destDir) {
  const yt =
    which('yt-dlp') ||
    which(`${process.env.HOME}/.local/bin/yt-dlp`) ||
    `${process.env.HOME}/.local/bin/yt-dlp`;
  if (!(await exists(yt)) && !which('yt-dlp')) {
    throw new Error(
      'yt-dlp not found. Install: pip install yt-dlp  (or pass --in local.mp4)',
    );
  }
  const bin = which('yt-dlp') || yt;
  const outTpl = join(destDir, 'source.%(ext)s');
  console.log(`Downloading with yt-dlp…`);
  run(bin, [
    '-f',
    'mp4/best[ext=mp4]/best',
    '--no-playlist',
    '-o',
    outTpl,
    url,
  ]);
  // find source.*
  const { readdirSync } = await import('node:fs');
  const files = readdirSync(destDir).filter((f) => f.startsWith('source.'));
  if (!files.length) throw new Error('yt-dlp produced no source file');
  return join(destDir, files[0]);
}

function trimClip(input, output, startSec, durationSec) {
  const ff = which('ffmpeg');
  if (!ff) throw new Error('ffmpeg not found');
  console.log(`Trimming ${startSec}s + ${durationSec}s → ${basename(output)}`);
  run(ff, [
    '-y',
    '-ss',
    String(startSec),
    '-i',
    input,
    '-t',
    String(durationSec),
    '-c:v',
    'libx264',
    '-an',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    output,
  ]);
}

function probeDuration(path) {
  const probe = which('ffprobe');
  if (!probe) return null;
  try {
    const out = run(probe, [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      path,
    ]);
    return Number(out.trim());
  } catch {
    return null;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    process.exit(0);
  }
  if (!args.emotion || (!args.in && !args.url)) {
    usage();
    console.error('Need --emotion and --in or --url');
    process.exit(1);
  }

  const outDir = resolve(String(args.out));
  await mkdir(outDir, { recursive: true });
  const emotion = String(args.emotion);
  const startSec = Number(args.start) || 0;
  const durationSec = Number(args.duration) || 8;
  const fps = Number(args.fps) || 24;

  let sourcePath;
  if (args.url) {
    sourcePath = await downloadYoutube(String(args.url), outDir);
  } else {
    sourcePath = resolve(String(args.in));
    if (!(await exists(sourcePath))) {
      throw new Error(`File not found: ${sourcePath}`);
    }
  }

  const clipName = `${emotion}_${Math.round(startSec)}s_${Math.round(durationSec)}s.mp4`;
  const clipPath = join(outDir, clipName);
  trimClip(sourcePath, clipPath, startSec, durationSec);
  const dur = probeDuration(clipPath);

  const job = buildClipJob({
    source: args.url ? String(args.url) : sourcePath,
    emotion,
    startSec,
    durationSec,
    fps,
    label: clipName,
  });

  const jobPath = join(outDir, `${emotion}.job.json`);
  const manifest = {
    ...job,
    clipPath,
    clipFile: clipName,
    clipDurationSec: dur,
    preparedAt: new Date().toISOString(),
    nextSteps: [
      'npm run yt-capture-batch   # or capture-studio',
      `Open batch UI and load ${clipName}`,
      'Record → Download NDJSON',
      `npm run capture-bake -- --emotion ${emotion} --in <ndjson> --apply-temporal`,
    ],
  };
  await writeFile(jobPath, JSON.stringify(manifest, null, 2));

  // Convenience copy path for batch UI default hint
  await writeFile(
    join(outDir, 'latest.json'),
    JSON.stringify(
      {
        emotion,
        clip: `/tools/yt-capture/out/${clipName}`,
        job: `/tools/yt-capture/out/${emotion}.job.json`,
      },
      null,
      2,
    ),
  );

  console.log('');
  console.log(`Prepared clip: ${clipPath}`);
  console.log(`Job:           ${jobPath}`);
  console.log(`Duration:      ${dur?.toFixed?.(2) ?? durationSec}s · emotion=${emotion}`);
  console.log('');
  console.log('Track in browser (MediaPipe + face quality gates):');
  console.log('  npm run yt-capture-batch');
  console.log('  http://127.0.0.1:5176/prototypes/yt-capture-batch.html');
  console.log(`  Load file: ${clipName}`);
  console.log('');
  console.log('Legal: respect YouTube ToS/copyright; bake abstract curves only — no likeness.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
