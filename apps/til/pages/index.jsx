import { blogsConfig } from '../config.d/blog.config';
import Link from 'next/link';
import { readJsonFile } from 'pkg/fs/functions';
import PropTypes from 'prop-types';
import { PageWrapper } from '../components/page';

const TitleList = ({ items }) => (
  <div>
    {items.map((item, idx) => (
      <div key={idx} className="flex flex-row gap-4">
        <div className="flex flex-col items-center h-min">
          <div className="bg-blue-900 rounded-full my-1 h-2 w-2 ring-4 ring-blue-200" />
          {idx + 1 !== items.length && <div className="bg-slate-400 h-8 w-0.5" />}
        </div>
        <Link key={item.href + idx} href={item.href} className="text-slate-800 dark:text-slate-200 h-min">
          <div className="leading-none text-lg">{item.title}</div>
        </Link>
      </div>
    ))}
  </div>
);

TitleList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
};

const Page = ({ dates, docMap }) => (
  <PageWrapper>
    {dates.map((date, idx) => (
      <div key={idx} className="flex flex-col gap-2 px-2 py-4 md:flex-row md:px-0 md:gap-4 md:items-center">
        <Link
          className="bg-blue-200 rounded-sm flex-initial w-40 px-4 py-2 h-min tracking-wide"
          href={`/d/${Buffer.from(date, 'utf-8').toString('base64')}`}
        >
          {date}
        </Link>
        <div className="flex-1 flex flex-col py-2 px-4 w-max">
          <TitleList
            items={docMap[date].map((attr) => ({ href: `/p/${attr.pageRef}`, title: attr.title }))}
          />
        </div>

        {/* <TilBlock href={`/p/${attrs.pageRef}`} title={attrs.title} /> */}
        {/* <Link href={`/p/${attrs.pageRef}`}> */}
        {/*  <div>{attrs.name}</div> */}
        {/*  <div>{attrs.title}</div> */}
        {/*  <div>{attrs.date}</div> */}
        {/* </Link> */}
      </div>
    ))}
  </PageWrapper>
);

Page.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.string),
  docMap: PropTypes.object,
};

export async function getStaticProps() {
  const dates = await readJsonFile(blogsConfig.DatesListFile);
  const doc = await readJsonFile(blogsConfig.DatesMapFile);
  return {
    props: {
      dates,
      docMap: doc,
    },
  };
}

export default Page;
