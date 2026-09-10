import { useRouter } from 'next/router';
import { DiningType } from 'api/dinings/entity';
import { useCafeteriaLiveNow } from 'components/cafeteria/hooks/useCafeteriaLiveNow';
import { DiningTime } from 'components/cafeteria/utils/time';
import { DINING_TYPES } from 'static/cafeteria';

const DATE_KEY = 'date';
const TYPE_KEY = 'type';

export const useCafeteriaParams = () => {
  const router = useRouter();
  const { query } = router;

  const renderToday = useCafeteriaLiveNow();
  const renderTomorrow = new Date(renderToday);
  renderTomorrow.setDate(renderToday.getDate() + 1);

  const dateParam = (): Date | null => (query[DATE_KEY] ? new Date(query[DATE_KEY] as string) : null);

  const shiftDate = (days: number) => {
    const base = dateParam() ?? new Date();
    base.setDate(base.getDate() + days);
    updateDateQuery(base.toISOString().slice(0, 10));
  };

  const date = {
    current: (): Date => dateParam() ?? renderToday,
    /** date 파라미터가 없을 때 매 렌더 새 Date를 반환하므로, 그대로 key로 쓰면 서브트리가 매번 재생성된다. */
    key: (Array.isArray(query[DATE_KEY]) ? query[DATE_KEY][0] : query[DATE_KEY]) ?? 'today',
    checkToday: (d: Date) => renderToday.toDateString() === d.toDateString(),
    checkTomorrow: (d: Date) => renderTomorrow.toDateString() === d.toDateString(),
    checkPast: (d: Date) => renderToday > d,
    setPrev: () => shiftDate(-1),
    setNext: () => shiftDate(1),
    setPrevWeek: () => shiftDate(-7),
    setNextWeek: () => shiftDate(7),
    set: (d: Date) => {
      const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      updateDateQuery(formatted);
    },
    setToday: () => updateDateQuery(new Date().toISOString().slice(0, 10)),
  };

  const diningType = DINING_TYPES.find((t) => t === query[TYPE_KEY]) ?? new DiningTime(renderToday).getType();

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
