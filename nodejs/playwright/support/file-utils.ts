import fs from 'node:fs';
import path from 'node:path';
import { RUNTIME_FOLDER } from './shared-variables';


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

