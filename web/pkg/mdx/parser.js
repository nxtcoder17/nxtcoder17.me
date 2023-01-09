import fs from 'fs/promises';
import fm from 'front-matter';

export const extractMetadata = async (mdFile) => {
  const data = await fs.readFile(mdFile);
  return fm(data.toString()).attributes;
};
