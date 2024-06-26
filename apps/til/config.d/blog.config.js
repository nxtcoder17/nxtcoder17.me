const path = require('path');
const os = require('os');

export const blogsConfig = {
  BlogsDir: path.join(process.cwd(), '.examples'),
  DatesMapFile: path.join(os.tmpdir(), 'blogs-dates-map.json'),
  IndexMapFile: path.join(os.tmpdir(), 'blogs-index-map.json'),
  DatesListFile: path.join(os.tmpdir(), 'blogs-dates-list.json'),
};
