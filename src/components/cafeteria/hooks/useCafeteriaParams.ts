import { useRouter } from 'next/router';
import { DiningType } from 'api/dinings/entity';
import { DiningTime } from 'components/cafeteria/utils/time';
import { DINING_TYPES } from 'static/cafeteria';

const DATE_KEY = 'date';
const TYPE_KEY = 'type';

export const useCafeteriaParams = () => {
  const router = useRouter();
  const { query } = router;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const date = {
    current: (): Date => (query[DATE_KEY] ? new Date(query[DATE_KEY] as string) : new Date()),
    checkToday: (d: Date) => today.toDateString() === d.toDateString(),
    checkTomorrow: (d: Date) => tomorrow.toDateString() === d.toDateString(),
    checkPast: (d: Date) => today > d,
    setPrev: () => {
      const newDate = new Date(date.current());
      newDate.setDate(newDate.getDate() - 1);
      updateDateQuery(newDate.toISOString().slice(0, 10));
    },
    setNext: () => {
      const newDate = new Date(date.current());
      newDate.setDate(newDate.getDate() + 1);
      updateDateQuery(newDate.toISOString().slice(0, 10));
    },
    setPrevWeek: () => {
      const newDate = new Date(date.current());
      newDate.setDate(newDate.getDate() - 7);
      updateDateQuery(newDate.toISOString().slice(0, 10));
    },
    setNextWeek: () => {
      const newDate = new Date(date.current());
      newDate.setDate(newDate.getDate() + 7);
      updateDateQuery(newDate.toISOString().slice(0, 10));
    },
    set: (d: Date) => {
      const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      updateDateQuery(formatted);
    },
    setToday: () => updateDateQuery(today.toISOString().slice(0, 10)),
  };

  const diningType = DINING_TYPES.find((t) => t === query[TYPE_KEY]) ?? new DiningTime().getType();

  const setDiningType = (type: DiningType) => {
    router.replace(
      { pathname: router.pathname, query: { ...router.query, [TYPE_KEY]: type } },
      undefined,
      { shallow: true },
    );
  };

  function updateDateQuery(value: string) {
    router.replace(
      { pathname: router.pathname, query: { ...router.query, [DATE_KEY]: value } },
      undefined,
      { shallow: true },
    );
  }

  return { date, diningType, setDiningType };
};
