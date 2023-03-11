import Highlight, { Prism } from 'prism-react-renderer';
import oceanicNext from 'prism-react-renderer/themes/oceanicNext';
import githubTheme from 'prism-react-renderer/themes/vsLight';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/theme-context';

// eslint-disable-next-line react/prop-types
const ThemeWrapper = ({ language, code, ...props }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Highlight
      theme={theme === 'light' ? githubTheme : oceanicNext}
      Prism={Prism}
      code={code}
      language={language}
      {...props}
    />
  );
};

const highlightClassName = 'bg-sky-100 border-l-4 border-sky-800';

let hlStart = false;
const highlightLine = (lineArray, lineProps) => {
  const lines = [];
  const lprops = { ...lineProps };

  // console.log('lineArray:', lineArray);

  for (let i = 0; i < lineArray.length; i += 1) {
    const { content } = lineArray[i];
    if (!hlStart && content.replace(/\s/g, '') === '#hl-start') {
      // console.log('started');
      hlStart = true;
      // eslint-disable-next-line no-continue
      continue;
    }

    if (hlStart) {
      lprops.className = `${lineProps.className} ${highlightClassName}`;
      // console.log('content: ', content);
    }

    if (hlStart && content.replace(/\s/g, '') === '#hl-end') {
      lprops.className.replace(highlightClassName, '');
      // console.log('end', lprops.className);
      hlStart = false;
      // eslint-disable-next-line no-continue
      continue;
    }

    lines.push(lineArray[i]);
  }
  return [lines, lprops];
};

const Block = ({
  // eslint-disable-next-line react/prop-types
  className: className2, style, tokens = [], getLineProps, getTokenProps,
}) => {
  if (tokens && tokens.length === 1) {
    // console.log("tokens: ", tokens[0], getLineProps({line: tokens[0], key: 0}))
    return (
      <span className="bg-teal-50 px-1.5 py-0.5 rounded-lg font-code text-mdxSm whitespace-pre-wrap break-words font-bold tracking-wider">
        {tokens[0][0].content}
      </span>
    );
  }

  return (
    <pre
      className={`${className2} font-code rounded-lg overflow-x-auto text-mdxBase border-4 border-dashed tracking-wide drop-shadow-2`}
      style={{ ...style, padding: '20px', lineHeight: '1.75rem' }}
    >
      {tokens.map((line, i) => {
        // eslint-disable-next-line react/no-array-index-key
        const [lineArray, lprops] = highlightLine(line, getLineProps({ line, key: i }));

        return (
          <div key={i} {...lprops}>
            {lineArray
              .filter((token) => !token.empty)
              .map((token, key) => (
                // eslint-disable-next-line react/no-array-index-key
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
          </div>
        );
      })}
    </pre>
  );
};

export const CodeBlock = ({ children, className }) => {
  const language = className?.replace(/language-/, '');
  return (
    <ThemeWrapper language={language} code={children}>
      {(props) => <Block {...props} />}
    </ThemeWrapper>
  );
};

CodeBlock.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  className: PropTypes.string,
};
