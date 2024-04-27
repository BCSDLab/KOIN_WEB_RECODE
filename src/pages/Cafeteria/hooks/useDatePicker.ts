import { useSearchParams } from 'react-router-dom';

const DATE_KEY = 'date';

export const useDatePicker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dateSearchParams = searchParams.get(DATE_KEY);

  const today = new Date();
  const currentDate = dateSearchParams !== null ? new Date(dateSearchParams) : today;

  const checkToday = (date: Date) => today.toDateString() === date.toDateString();
  const checkPast = (date: Date) => today > date;

  const setPrev = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  const setNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  const setDate = (date: Date) => {
    const newDate = new Date(date);
    searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
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
    currentDate, checkToday, checkPast, setPrev, setNext, setDate, setToday,
  };
};
