import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import weekday from 'dayjs/plugin/weekday';
import PropTypes from "prop-types";

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

const getMonthDays = (year) => [
  31, // january,
  isLeapYear(year) ? 29 : 28, // february
  31, // march
  30, // april
  31, // may
  30, // june
  31, // july
  31, // august
  30, // sep
  31, // oct
  30, // november
  31, // december
];

dayjs.extend(localizedFormat);
dayjs.extend(weekday);

const Day = ({ date, onClick }) => (
  <div className="border border-gray-200 h-48 w-48 p-6 flex flex-col" onClick={onClick}>
    {/* <div className="text-sm"> */}
    {/*  {dayjs(date).format('LL')} */}
    {/* </div> */}
    <div className="flex flex-col flex-1 rounded-3xl bg-blue-50 text-blue-900 tracking-wide">
      <div className="bg-blue-100 flex justify-center">
        {dayjs(date).format('ddd')}
      </div>
      <div
        className="text-8xl text-bold flex justify-center items-center flex-1"
      >
        {dayjs(date).date()}
      </div>
    </div>
  </div>
);

Day.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onClick: PropTypes.func,
};

const Month = ({ date }) => {
  const [tDays, setTDays] = useState(dayjs(date).daysInMonth());
  useEffect(() => {
    setTDays(dayjs(date).daysInMonth());
  }, [date]);
  return (
    <div className="flex flex-wrap">
      {new Array(tDays)
        .fill(undefined)
        .map((d, idx) => <Day key={idx} date={dayjs(d).date(idx + 1).toDate()} />)}
    </div>
  );
};

Month.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
};

export const Calendar = {
  Day,
  Month,
};

export const BlogCalendar = ({ date = new Day() }) => {
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth());
  const [mm, setMm] = useState(getMonthDays(year));
  useEffect(() => {
    setMm(getMonthDays(year));
  }, [year]);

  return (
    <div className="flex flex-wrap container mx-auto items-center">
      {new Array(mm[month]).fill(undefined).map((_, idx) => (
        <div key={idx} className="border border-gray-300 h-48 w-48 p-4">
          <div>
            Hello
            {idx + 1}
          </div>
        </div>
      ))}
    </div>
  );
};
