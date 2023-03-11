import { MDXRemote } from 'next-mdx-remote';
import { MDXComponents } from 'pkg/mdx/components';

export const MdDocumentRenderer = (props) => (
  <div className="flex flex-col gap-2.5 py-2 px-3 md:px-0 overflow-x-hidden">
    <MDXRemote {...props} components={MDXComponents} />
  </div>
);
