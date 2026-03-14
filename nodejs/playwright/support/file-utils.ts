import fs from 'node:fs';
import path from 'node:path';


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

