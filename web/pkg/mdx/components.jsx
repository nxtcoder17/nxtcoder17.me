const Ul = (props) => {
  return <ul className="list-disc list-inside px-4" {...props} />;
};

const Ol = (props) => {
  return <ol className="list-decimal list-inside px-4" {...props} />;
};

const Li = (props) => {
  return <li {...props} />;
};

const A = (props) => {
  return <a className="text-indigo-400 font-medium" {...props} />;
};

export const MDXComponents = {
  p: (props) => <div className="dark:text-coolGray-300 " {...props} />,
  h1: Title1,
  h2: Title2,
  h3: SubTitle,
  img: (props) => (
    <div className="w-full flex flex-row justify-center bg-gray-200 object-cover">
      <img {...props} alt="This is an img" className="w-full" />
    </div>
  ),
  a: A,
  pre: (props) => <pre {...props} />,
  code: (props) => <CodeBlock className="font-code" {...props} />,
  ul: Ul,
  ol: Ol,
  li: Li,
};
