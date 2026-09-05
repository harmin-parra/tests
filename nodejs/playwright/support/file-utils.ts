import fs from 'node:fs';
import path from 'node:path';
import { RUNTIME_FOLDER } from './shared-variables';
import { access, readdir, readFile, stat } from 'node:fs/promises';


export async function loadJson(filePath: string) {
  const content = await readFile(filePath, 'utf8');
  return JSON.parse(content);
}

export function appendLineToFile(filename: string = null, content: string) {
  if (filename && filename.length > 0) {
    const FILE = path.join(RUNTIME_FOLDER, filename);
    fs.writeFileSync(FILE, content + '\n', { flag: 'a' });
  }
}

export function readPropertyFile(filename: string): Record<string, string> {
  filename = path.join(RUNTIME_FOLDER, filename);
  const content = fs.readFileSync(filename, 'utf-8');
  const properties: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#'))
      continue;
    const [key, ...rest] = trimmed.split('=');
    properties[key.trim()] = rest.join('=').trim();
  }
  return properties;
}

function deleteFolderEntries(folder: string) {
  const entries = fs.readdirSync(folder, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.'))
      continue;
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) {
      fs.rmSync(full, { recursive: true, force: true });
    } else {
      fs.unlinkSync(full);
    }
  }
}

function recreateFolder(folder: string): void {
  try {
    fs.rmSync(folder, { recursive: true, force: true });
    fs.mkdirSync(folder, { recursive: true });
  } catch (err) {
    console.error("Error recreating folder: " + folder + '\n', err);
  }
}

export async function getRecentFiles(directory: string, prefix: string, count: number = 10): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
    .filter(name => name.startsWith(prefix))
    .sort((a, b) => b.localeCompare(a))
    .slice(0, count);
}

async function waitForFile(
  filePath: string,
  timeout = 30_000,
  interval = 1000
): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      await access(filePath);
      return;
    } catch {
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

  throw new Error(`File was not created within ${timeout}ms: ${filePath}`);
}

async function waitForFileStable(
  filePath: string,
  timeout = 30_000,
  interval = 500
): Promise<void> {
  const start = Date.now();
  let previousSize = -1;

  while (Date.now() - start < timeout) {
    try {
      const { size } = await stat(filePath);

      if (size > 0 && size === previousSize) {
        return;
      }

      previousSize = size;
    } catch {
      previousSize = -1;
    }

    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(`File was not stable within ${timeout}ms: ${filePath}`);
}
