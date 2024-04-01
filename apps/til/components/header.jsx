import Link from 'next/link';
import { useTheme } from 'pkg/theme';
import PropTypes from 'prop-types';

export const NavHeader = ({ href }) => {
  const [theme] = useTheme();

  return (
    <Link href={href}>
      <div className="bg-sky-100 py-2 flex flex-row justify-center gap-4 px-4 items-baseline">
        {/* <span className="tracking-wider font-bold"> */}
        {/*   <span className="text-4xl">nxtcoder17</span> */}
        {/*   <span className="text-2xl">&apos;s</span> */}
        {/* </span> */}
        <span className="text-2xl tracking-wider font-bold">Today I Learned</span>
        <div>{theme}</div>
      </div>
    </Link>
  );
};

NavHeader.propTypes = {
  href: PropTypes.string.isRequired,
};
