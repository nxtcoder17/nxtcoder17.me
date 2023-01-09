import { Calendar } from 'pkg/calendar/calendar';

const Page = () => (
  <div>
    <Calendar.Month date={new Date()} />
  </div>
);

export default Page;
