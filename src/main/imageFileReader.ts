import fs from 'fs';
import path from 'path';

import { getUserDatabaseDir } from './iconPaths';

function aListImages(): string[] {
  const dir = getUserDatabaseDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.toLowerCase().endsWith('.bmp'));
}

function aReadImageFile(sFileName: string): Buffer | undefined {
  const filePath = path.join(getUserDatabaseDir(), path.basename(sFileName));
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath);
  }
  return undefined;
}

const fileReader = { aListImages, aReadImageFile };

export default fileReader;
