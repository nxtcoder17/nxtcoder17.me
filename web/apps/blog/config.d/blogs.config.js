import { env } from './env.config';
import os from 'os';

export const blogsConfig = {
  BlogsDir: env.BlogsDir,
  IndexListFile: `${os.tmpdir()}/blogs-index.list`,
  IndexMapFile: `${os.tmpdir()}/blogs-index.map`,
};
