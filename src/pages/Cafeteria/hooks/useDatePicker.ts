import { useSearchParams } from 'react-router-dom';
import { DiningTime } from 'utils/ts/cafeteria';

const DATE_KEY = 'date';

export const useDatePicker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dateSearchParams = searchParams.get(DATE_KEY);

  const today = new Date();
  const diningTime = new DiningTime();
  const currentDate = () => {
    if (dateSearchParams !== null) {
      return new Date(dateSearchParams);
    }

    return diningTime.generateDiningDate();
  };

  const checkToday = (date: Date) => today.toDateString() === date.toDateString();
  const checkPast = (date: Date) => today > date;

  const setPrev = () => {
    const newDate = new Date(currentDate());
    newDate.setDate(newDate.getDate() - 1);
    searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  const setNext = () => {
    const newDate = new Date(currentDate());
    newDate.setDate(newDate.getDate() + 1);
    searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  const setPrevWeek = () => {
    const newDate = new Date(currentDate());
    newDate.setDate(newDate.getDate() - 7);
    searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  const setNextWeek = () => {
    const newDate = new Date(currentDate());
    newDate.setDate(newDate.getDate() + 7);
    searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  const setDate = (date: Date) => {
    const formatedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    searchParams.set(DATE_KEY, formatedDate);
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  const setToday = () => {
    const newDate = today;
    searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  return {
    currentDate,
    checkToday,
    checkPast,
    setPrev,
    setNext,
    setPrevWeek,
    setNextWeek,
    setDate,
    setToday,
  };
};
