'use client';

import dayjs from 'dayjs';
import fs from 'fs/promises';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { blogsConfig } from '../config.d/blogs.config';

dayjs.extend(localizedFormat);

// const BlogList = ({ children }) => (
//   <div className="flex flex-wrap gap-2">
//     {children}
//   </div>
// );
//
// const BlogEntry = ({
//   title, tags, date, description,
// }) => (
//   <div className="h-64 w-64 bg-teal-50 rounded-md">
//     <div className="text-blue-300">{dayjs(date).format('LL')}</div>
//     <div className="text-lg">{title}</div>
//   </div>
// );

async function getBlogs() {
  const blogsList = await fs.readFile(blogsConfig.IndexListFile);
  const blogsMap = await fs.readFile(blogsConfig.IndexMapFile);

  console.log(blogsList, blogsMap)
  return {
    blogsList: JSON.parse(blogsList),
    blogsMap: JSON.parse(blogsMap),
  };
}

export default async function Page() {
  const { blogsList, blogsMap } = await getBlogs();
  return (
    <div>
      {JSON.stringify(blogsList)}

      {JSON.stringify(blogsMap)}
    </div>
  );
}
