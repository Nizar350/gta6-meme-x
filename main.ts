// Entry program for make.fun's gta6-meme-x-01 bounty ("Post a GTA 6 meme on X").
//
// The entry itself is a post on X: one GTA 6 meme picture plus the post's
// text. This repository only has to tell the house where that post lives.
// POST.json, sitting at the repository root, holds the post's address, and
// this program's whole job is to place a copy of that file where the
// grader reads it from. Nothing else is computed, fetched or written.
//
// Directory contract:
//   MAKEFUN_BOT_DIR     the folder this repository is checked out into
//                       (defaults to /bot inside the grader's container)
//   MAKEFUN_OUTPUT_DIR  the folder the copy of POST.json must land in
//                       (defaults to /output)
// The program reads no clock, reaches for no network and touches no file
// outside those two folders, so two runs always leave the same bytes.

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const repoDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A fresh grading run may not have created the output folder yet.
mkdirSync(outputDir, { recursive: true });

const postFileSource = join(repoDir, 'POST.json');
const postFileTarget = join(outputDir, 'POST.json');

try {
  copyFileSync(postFileSource, postFileTarget);
} catch (problem) {
  // Without POST.json there is no entry to grade, so fail loudly instead
  // of letting the run look successful with nothing handed in.
  console.error(
    `POST.json could not be copied from ${postFileSource}: ${(problem as Error).message}`,
  );
  process.exit(1);
}
