import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import BusLookUp from './BusLookUp';
import BusTimetable from './BusTimetable';

function BusPage() {
  useScrollToTop();

  return (
    <main>
      <BusLookUp />
      <BusTimetable />
    </main>
  );
}

export default BusPage;
