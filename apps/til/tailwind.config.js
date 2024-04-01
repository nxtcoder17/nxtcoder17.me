// import { THEME_LIGHT } from 'pkg/theme/styles';

const path = require('path');

const purgePath = [
  path.resolve(__dirname, './pages/**/*.jsx'),
  path.resolve(__dirname, './components/**.jsx'),
  path.resolve(__dirname, '../../pkg/**/*.jsx'),
];

const mdxScaleFactor = 1.2;

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        // sans: ['"Recursive"'],
        sans: ['"Comic Neue"'],
        // sans: ['"Cantamaran"'],
        // sans: ['"Comic Code Ligatures"'],
        // code: ['"Comic Code Ligatures"', '"Fira Code"'],
        code: ['"Comic Neue"'],
      },
      fontSize: {
        mdxSm: `${0.9 * mdxScaleFactor}rem`,
        mdxBase: `${1 * mdxScaleFactor}rem`,
        mdxLg: `${1.125 * mdxScaleFactor}rem`,
        mdxXl: `${1.25 * mdxScaleFactor}rem`,
        mdx2xl: `${1.563 * mdxScaleFactor}rem`,
        mdx3xl: `${1.953 * mdxScaleFactor}rem`,
        mdx4xl: `${2.441 * mdxScaleFactor}rem`,
        mdx5xl: `${3.052 * mdxScaleFactor}rem`,
      },
      colors: {
        // Using modern `rgb`
        // 'content-fg': 'rgb(var(--color-content-fg) / <alpha-value>)',
        'header-text': 'var(--color-header-text)',
        'header-bg': 'var(--color-header-bg)',
      },
    },
  },
  // presets: [projectTwConfig],
  content: purgePath,
  darkMode: 'class',
};
