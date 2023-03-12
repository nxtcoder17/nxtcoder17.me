import { Calendar } from 'pkg/calendar/calendar';
import PropTypes from 'prop-types';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXComponents } from 'pkg/mdx/components';
import { MDXRemote } from 'next-mdx-remote';
import fs from 'fs/promises';
import path from 'path';
import remarkGfm from 'remark-gfm';

const tagColors = [
  '#3d6673',
  '#bbb5b1',
  '#605d5c',
  '#ad8b7c',
  '#76402f',
];

// const customRenderer = (tag, size, color) => (
//   <span key={tag.value} style={{ color: tagColors[(Math.random() * 10) % 5] }} className="p-4">
//     {tag.value}
//   </span>
// );

const TagsBar = ({ tags }) => (
  <div className="bg-blue-100">
    <div className="tracking-wider text-2xl text-medium">#topics</div>
    <div className="w-80 text-lg flex flex-wrap gap-4">
      {tags.map((item) => (
        <span className="text-italic">
          #
          {item}
        </span>
      ))}
    </div>
  </div>
);

TagsBar.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
};

// eslint-disable-next-line react/prop-types
const Page = ({ mdxSource }) => (
  <div className="flex flex-col">
    <div>This is kitchen sink</div>
    <Calendar.Month date={new Date()} />
    <TagsBar tags={['kubernetes', 'javascript', 'shell', 'i3wm', 'golang']} />
    <MDXRemote {...mdxSource} components={MDXComponents} />
  </div>
);

// export async function getStaticPaths() {
//   const lsDir = await fs.readdir(path.resolve(process.cwd(), '.examples'));
//   return {
//     paths: lsDir.map((p) => ({ params: { p: p.toString() } })),
//     fallback: false,
//   };
// }

export async function getStaticProps() {
  const doc = await fs.readFile(path.join(process.cwd(), '.examples/2023/January/15/sample-doc.md'));
  return {
    props: {
      mdxSource: await serialize(doc.toString(), {
        mdxOptions: {
          remarkPlugins: [
            remarkGfm,
          ],
        },
      }),
    },
  };
}

export default Page;
