import { CodeBlock } from './code-renderer';

const Ul = (props) => <ul className="list-disc list-inside px-4 text-mdxBase" {...props} />;

const Ol = (props) => <ol className="list-decimal list-inside px-4 text-mdxBase" {...props} />;

// eslint-disable-next-line react/prop-types
const Li = ({ children, ...props }) => <li className="px-4 text-mdxBase" {...props}>{children}</li>;

// eslint-disable-next-line react/prop-types
const A = ({ children, ...props }) => <a className="text-indigo-400 font-medium text-mdxBase" {...props}>{children}</a>;

export const MDXComponents = {
  p: (props) => <div className="dark:text-coolGray-300 text-mdxBase" {...props} />,
  h1: (props) => <h1 className="text-mdx3xl font-bold tracking-wide border-l-4 border-slate-400 px-4 bg-slate-100" {...props}>{props.children}</h1>,
  h2: (props) => <h2 className="text-mdx2xl font-bold tracking-wide decoration-wavy" {...props}>{props.children}</h2>,
  h3: ({ children, ...props }) => <h3 className="text-mdxLg font-bold tracking-wide underline decoration-wavy pb-2 pt-1 capitalize" {...props}>{children}</h3>,
  img: (props) => (
    <div className="w-full flex flex-row justify-center bg-gray-200 object-cover">
      <img {...props} alt="This is an img" className="w-full" />
    </div>
  ),
  a: A,
  details: (props) => <div className="text-mdx2xl bg-red-200" {...props} />,
  pre: (props) => <div className="font-code" {...props} />,
  code: (props) => <CodeBlock {...props} />,
  blockquote: (props) => <div className="bg-blue-100 px-4 py-2" {...props} />,
  ul: Ul,
  ol: Ol,
  li: Li,
};
