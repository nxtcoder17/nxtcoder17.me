const { extractMetadata } = require('pkg/mdx/parser');
const path = require('path');
const fs = require('fs/promises');
const { blogsConfig } = require('./blog.config');
const { exists, ls } = require('pkg/fs/functions');

(async () => {
  if (!(await exists(blogsConfig.BlogsDir))) {
    console.error(`${blogsConfig.BlogsDir} directory does not exist, aborting indexing ...`);
  }

  const blogPosts = {};

  const years = await ls(blogsConfig.BlogsDir);
  await Promise.all(
    years.map(async (year) => {
      const months = await ls(path.resolve(blogsConfig.BlogsDir, year));
      await Promise.all(months.map(async (month) => {
        const days = await ls(path.resolve(blogsConfig.BlogsDir, year, month));
        await Promise.all(days.map(async (day) => {
          const docs = await ls(path.resolve(blogsConfig.BlogsDir, year, month, day));
          const key = `${day} ${month}, ${year}`;
          blogPosts[key] = await Promise.all(docs.map(async (doc) => {
            const attrs = await extractMetadata(path.resolve(blogsConfig.BlogsDir, year, month, day, doc));
            return {
              ...attrs,
              date: key,
              pageRef: Buffer.from(path.resolve(blogsConfig.BlogsDir, year, month, day, doc).toString(), 'utf-8').toString('base64url'),
            };
          }));
        }));
      }));
    }),
  );

  console.log(JSON.stringify(blogPosts, null, 2));

  const blogDates = Object.keys(blogPosts);
  blogDates.sort((x, y) => {
    const i = Date.parse(x) / 1e4;
    const j = Date.parse(y) / 1e4;
    return i > j ? -1 : 1; // descending order
  });

  const postsMap = blogDates.reduce((acc, curr) => {
    const x = { ...acc };
    blogPosts[curr].forEach((item) => {
      x[item.pageRef] = item;
    });
    return x;
  }, {});

  await Promise.all([
    fs.writeFile(blogsConfig.DatesMapFile, JSON.stringify(blogPosts, null, 2)),
    fs.writeFile(blogsConfig.IndexMapFile, JSON.stringify(postsMap, null, 2)),
    fs.writeFile(blogsConfig.DatesListFile, JSON.stringify(blogDates, null, 2)),
  ]);
})();
