import { useRouter } from 'next/router';

const DATE_KEY = 'date';

export const useDatePicker = () => {
  const router = useRouter();
  const { query } = router;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const currentDate = () => {
    if (query[DATE_KEY]) {
      return new Date(query[DATE_KEY] as string);
    }
    return new Date();
  };

  const checkToday = (date: Date) => today.toDateString() === date.toDateString();
  const checkTomorrow = (date: Date) => tomorrow.toDateString() === date.toDateString();
  const checkPast = (date: Date) => today > date;

  const updateQuery = (value: string) => {
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, [DATE_KEY]: value },
      },
      undefined,
      { shallow: true },
    );
  };

  const setPrev = () => {
    const newDate = new Date(currentDate());
    newDate.setDate(newDate.getDate() - 1);
    updateQuery(newDate.toISOString().slice(0, 10));
  };

  const setNext = () => {
    const newDate = new Date(currentDate());
    newDate.setDate(newDate.getDate() + 1);
    updateQuery(newDate.toISOString().slice(0, 10));
  };

  const setPrevWeek = () => {
    const newDate = new Date(currentDate());
    newDate.setDate(newDate.getDate() - 7);
    updateQuery(newDate.toISOString().slice(0, 10));
  };

  const setNextWeek = () => {
    const newDate = new Date(currentDate());
    newDate.setDate(newDate.getDate() + 7);
    updateQuery(newDate.toISOString().slice(0, 10));
  };

  const setDate = (date: Date) => {
    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
    updateQuery(formatted);
  };

  const setToday = () => {
    updateQuery(today.toISOString().slice(0, 10));
  };

  return {
    currentDate,
    checkToday,
    checkTomorrow,
    checkPast,
    setPrev,
    setNext,
    setPrevWeek,
    setNextWeek,
    setDate,
    setToday,
  };
};
