import fs from 'fs/promises';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import { blogsConfig } from '../../config.d/blog.config';
import { MDXRemote } from 'next-mdx-remote';
import { MDXComponents } from 'pkg/mdx/components';
import PropTypes from 'prop-types';
import { PageWrapper } from '../../components/page';
import matter from 'gray-matter';

const Page = ({ blogPosts }) => (
  <PageWrapper>
    {blogPosts.map((bp, idx) => (
      <MDXRemote key={bp.pageRef + idx} {...bp.mdxSource} components={MDXComponents} />
    ))}
  </PageWrapper>
);

Page.propTypes = {
  blogPosts: PropTypes.arrayOf(PropTypes.any),
};

async function readJsonFile(fp) {
  const bp = await fs.readFile(fp);
  return JSON.parse(bp.toString());
}

export async function getStaticPaths() {
  const datesList = await readJsonFile(blogsConfig.DatesListFile);
  return {
    paths: datesList.map((d) => ({ params: { date: Buffer.from(d, 'utf-8').toString('base64') } })),
    fallback: false,
  };
}

export async function getStaticProps(ctx) {
  const date = Buffer.from(ctx.params.date, 'base64url').toString('utf-8');
  const datesMap = await readJsonFile(blogsConfig.DatesMapFile);
  const docs = await Promise.all(
    datesMap[date].map(async (bp) => fs.readFile(Buffer.from(bp.pageRef, 'base64').toString('utf-8'))),
  );

  return {
    props: {
      blogPosts: await Promise.all(docs.map(async (item) => {
        const { content } = matter(item);
        return ({
          mdxSource: await serialize(content, {
            mdxOptions: {
              remarkPlugins: [
                remarkGfm,
              ],
            },
          }),
        });
      })),
    },
  };
}

export default Page;
