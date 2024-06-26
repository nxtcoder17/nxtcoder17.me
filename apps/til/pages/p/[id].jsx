import { serialize } from 'next-mdx-remote/serialize';
// import remarkGfm from 'remark-gfm';
import { blogsConfig } from '../../config.d/blog.config';
import * as fs from 'pkg/fs/functions';
import matter from 'gray-matter';
import PropTypes from 'prop-types';
import { PageWrapper } from '../../components/page';
import { MdDocumentRenderer } from '../../components/md-doc-renderer';

const Page = ({ mdxSource }) => (
  <PageWrapper>
    <MdDocumentRenderer {...mdxSource} />
  </PageWrapper>
);

Page.propTypes = {
  mdxSource: PropTypes.any,
};

export async function getStaticPaths() {
  const pMap = await fs.readJsonFile(blogsConfig.IndexMapFile);
  return {
    paths: Object.keys(pMap).map((k) => ({ params: { id: k } })),
    fallback: false,
  };
}

export async function getStaticProps(ctx) {
  const { id } = ctx.params;
  const dp = Buffer.from(id, 'base64url').toString('utf-8');
  const doc = await fs.readFile(dp);
  const { content } = matter(doc);
  return {
    props: {
      mdxSource: await serialize(content, {
        // mdxOptions: { remarkPlugins: [remarkGfm] },
      }),
    },
  };
}

export default Page;
