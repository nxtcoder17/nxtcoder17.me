const { extractMetadata } = require('pkg/mdx/parser');
const path = require('path');
const fsPromise = require('fs/promises');
const { blogsConfig } = require('../../config.d/blogs.config');

async function exists(itemPath) {
  try {
    await fsPromise.stat(itemPath);
    return true;
  } catch (err) {
    return false;
  }
}

(async () => {
  if (!(await exists(blogsConfig.BlogsDir))) {
    console.error(`${blogsConfig.BlogsDir} directory does not exist, aborting indexing ...`);
  }

  const dirList = await fsPromise.readdir(blogsConfig.BlogsDir);
  const metadataFiles = await Promise.all(dirList
    .filter((item) => item.endsWith('.md') || item.endsWith('.mdx'))
    .map(async (blog) => extractMetadata(path.resolve(blogsConfig.BlogsDir, blog))));

  metadataFiles.sort((x, y) => {
    const i = Date.parse(x.date) / 1e4;
    const j = Date.parse(y.date) / 1e4;
    return i > j ? -1 : 1;
  });

  const metadataMap = metadataFiles.reduce(
    (acc, curr) => ({ ...acc, [curr.id]: curr }),
    {},
  );

  const metadataIdList = metadataFiles.map((item) => item.id);

  await Promise.all([
    fsPromise.writeFile(blogsConfig.IndexMapFile, JSON.stringify(metadataMap, null, 2)),
    fsPromise.writeFile(blogsConfig.IndexListFile, JSON.stringify(metadataIdList, null, 2)),
  ]);
})();
