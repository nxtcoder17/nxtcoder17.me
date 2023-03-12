import fs from 'fs/promises';

export async function exists(itemPath) {
  try {
    await fs.stat(itemPath);
    return true;
  } catch (err) {
    return false;
  }
}

export async function readJsonFile(fp) {
  const bp = await fs.readFile(fp);
  return JSON.parse(bp.toString());
}

export async function readFile(fp) {
  return fs.readFile(fp);
}

export async function ls(dirPath) {
  return fs.readdir(dirPath);
}
