const path = require('path');
const projectTwConfig = require("../../tailwind.config")

const purgePath = [
  path.resolve(__dirname, './app/**/*.jsx'),
  path.resolve(__dirname, './lib/**/*.jsx'),
  path.resolve(__dirname, '../../pkg/**/*.jsx'),
];

const blogTheme = {
  fontFamily: {
    sans: ['Recursive'],
    logo: ['Nova Mono'],
  },
  extend: {
    colors: {
      darkPage: '#111a1f',
      darkHeader: '#1a2833',
      blogPost: '#2b3740',
      textPrimary: '#9dafbd',
      code: {
        inline: '#263a4a',
      },
    },
  },
};

module.exports = {
  theme: blogTheme,
  presets: [projectTwConfig],
  content: purgePath,
};
