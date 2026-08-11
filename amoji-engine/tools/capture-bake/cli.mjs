#!/usr/bin/env node
/**
 * Capture → Bake CLI (authoring)
 *
 * Usage:
 *   node tools/capture-bake/cli.mjs --emotion happy --in take.ndjson --out baked/
 *   node tools/capture-bake/cli.mjs --demo
 *
 * Input: Live Link NDJSON / JSON array / { frames: [...] } from video tracking.
 * Output: recipe fragment + temporal envelope JSON (hand-tune before merge).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  bakeCaptureTake,
  mergeRecipeFragment,
} from '../../engine/capture/captureBake.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function usage() {
  console.log(`Amoji capture-bake — video ARKit curves → intensity + timing recipes

Options:
  --emotion <id>   Emotion key (required unless --demo)
  --in <path>      Capture take (.ndjson | .json)
  --out <dir>      Output directory (default: tools/capture-bake/out)
  --fps <n>        Fallback FPS (default 60)
  --overwrite      Allow replacing existing emotion in --merge-into
  --merge-into <path>  Optional intensity-sculpt-recipes.json to merge fragment
  --demo           Bake built-in synthetic happy take
  --help
`);
}

function parseArgs(argv) {
  /** @type {Record<string, string|boolean>} */
  const out = { out: join(__dirname, 'out') };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') out.help = true;
    else if (a === '--demo') out.demo = true;
    else if (a === '--overwrite') out.overwrite = true;
    else if (a.startsWith('--')) {
      const key = a.slice(2);
      out[key] = argv[++i];
    }
  }
  return out;
}

async function loadTake(path) {
  const text = await readFile(path, 'utf8');
  return text;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    process.exit(0);
  }

  let input;
  let emotion = /** @type {string} */ (args.emotion || '');

  if (args.demo) {
    const mod = await import(
      pathToFileURL(join(__dirname, 'fixtures/sample-happy-take.mjs')).href
    );
    input = mod.sampleHappyTake;
    emotion = emotion || 'happy';
  } else {
    if (!args.in || !emotion) {
      usage();
      console.error('Need --emotion and --in (or --demo)');
      process.exit(1);
    }
    input = await loadTake(resolve(String(args.in)));
  }

  const bake = bakeCaptureTake(input, {
    emotion,
    fps: args.fps ? Number(args.fps) : 60,
  });

  const outDir = resolve(String(args.out));
  await mkdir(outDir, { recursive: true });

  const stamp = emotion;
  const recipePath = join(outDir, `${stamp}.recipe-fragment.json`);
  const temporalPath = join(outDir, `${stamp}.temporal.json`);
  const fullPath = join(outDir, `${stamp}.bake.json`);

  await writeFile(
    recipePath,
    JSON.stringify(
      {
        note: 'Merge into data/emotions/intensity-sculpt-recipes.json after hand-tune',
        recipes: bake.recipeFragment,
      },
      null,
      2,
    ),
  );
  await writeFile(temporalPath, JSON.stringify(bake.envelope, null, 2));
  await writeFile(fullPath, JSON.stringify(bake, null, 2));

  console.log(`Baked ${emotion}`);
  console.log(
    `  frames=${bake.take.frameCount} duration=${bake.take.durationSec.toFixed(2)}s valid=${bake.envelope.valid}`,
  );
  console.log(
    `  onset=${bake.envelope.onsetSec}s apex=${bake.envelope.apexSec}s offset=${bake.envelope.offsetSec}s`,
  );
  console.log(`  stepOut≈${bake.envelope.suggestedStepOutSec}s blinks=${bake.envelope.blinks.length}`);
  console.log(`  → ${recipePath}`);
  console.log(`  → ${temporalPath}`);
  console.log(`  → ${fullPath}`);

  if (args['merge-into']) {
    const target = resolve(String(args['merge-into']));
    const existing = JSON.parse(await readFile(target, 'utf8'));
    const merged = mergeRecipeFragment(existing, bake.recipeFragment, {
      overwrite: !!args.overwrite,
    });
    const mergedPath = join(outDir, `${stamp}.merged-recipes.json`);
    await writeFile(mergedPath, JSON.stringify(merged, null, 2));
    console.log(`  → ${mergedPath} (review before replacing ${target})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
