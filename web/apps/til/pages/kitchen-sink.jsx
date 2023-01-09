import { Calendar } from 'pkg/calendar/calendar';
import { TagCloud } from 'react-tagcloud';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';

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

const Page = () => (
  <div className="flex flex-col">
    <div>This is kitchen sink</div>
    <Calendar.Month date={new Date()} />
    <TagsBar tags={['kubernetes', 'javascript', 'shell', 'i3wm', 'golang']} />
  </div>
);

export default Page;
