import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const projectDir = fileURLToPath(new URL('.', import.meta.url));
const destinationDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const SCORER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function ensureFolderExists(folderPath: string, name: string): void {
  if (!existsSync(folderPath) || !statSync(folderPath).isDirectory()) {
    throw new Error(`Expected ${name} folder at ${folderPath}`);
  }
}

function buildHouseholdSubmission(): void {
  const appSource = join(projectDir, 'app');
  const shotsSource = join(projectDir, 'screenshots');
  ensureFolderExists(appSource, 'app');

  mkdirSync(destinationDir, { recursive: true });
  cpSync(appSource, join(destinationDir, 'app'), { recursive: true });

  const shotsDest = join(destinationDir, 'screenshots');
  mkdirSync(shotsDest, { recursive: true });
  if (existsSync(shotsSource)) {
    const files = readdirSync(shotsSource).filter((f) => !f.startsWith('.')).sort();
    for (const file of files) {
      cpSync(join(shotsSource, file), join(shotsDest, file));
    }
  }

  const dossierJson = buildDossier(destinationDir, SCORER_CAPS);
  const targetDossier = join(destinationDir, 'dossier.json');
  writeFileSync(targetDossier, dossierJson);
}

buildHouseholdSubmission();
