// gta6-meme-x-01 entry program (Node 22, standard library only).
//
// The entry itself is the X post: the house reads POST.json from the repo,
// fetches the post from X, and judges its first picture plus its text.
// All this program has to do is hand POST.json over: copy it from the
// bot directory into the output directory, creating the output directory
// first when it is missing. It takes no arguments and prints nothing on
// success, so the grader can run it bare: `node main.ts`.
//
// Outside the grader's container the two directories are overridable:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const FILE_NAME = 'POST.json';

function fail(message: string): never {
  console.error(`gta6-meme-x-01: ${message}`);
  process.exit(1);
}

const sourcePath = join(BOT_DIR, FILE_NAME);
let raw: Buffer;
try {
  raw = readFileSync(sourcePath);
} catch (err) {
  fail(`could not read ${sourcePath}: ${(err as Error).message}`);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw!.toString('utf8'));
} catch (err) {
  fail(`${FILE_NAME} is not valid JSON: ${(err as Error).message}`);
}
if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
  fail(`${FILE_NAME} must be a JSON object naming the post`);
}
const url = (parsed as Record<string, unknown>).url;
// A quick shape check so a placeholder or a mistyped address fails here,
// in plain language, instead of travelling to the grader and being refused.
if (typeof url !== 'string' || !url.startsWith('https://x.com/')) {
  fail(`${FILE_NAME} must carry a url like https://x.com/<handle>/status/<id>`);
}

try {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(join(OUTPUT_DIR, FILE_NAME), raw!);
} catch (err) {
  fail(`could not write ${FILE_NAME} to ${OUTPUT_DIR}: ${(err as Error).message}`);
}
