import { formatDate, formatTime } from 'pages/Bus/BusRoutePage/utils/timeModule';
import { useState } from 'react';

interface TimeState {
  nowDate: Date;
  dayOfMonth: number;
  hour: number;
  minute: number;
}

interface TimeHandlers {
  setNow: (date: Date) => void;
  setDayOfMonth: (date: number) => void;
  setHour: (hour: number) => void;
  setMinute: (minute: number) => void;
}

interface FormattedTime {
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:mm'
}

export interface UseTimeSelectReturn {
  timeState: TimeState;
  timeHandler: TimeHandlers;
  formattedValues: FormattedTime;
}

export const useTimeSelect = () => {
  const nowDate = new Date();
  const [timeState, setTimeState] = useState({
    nowDate,
    dayOfMonth: nowDate.getDate(),
    hour: nowDate.getHours(),
    minute: nowDate.getMinutes(),
  });

  const timeHandler = {
    setNow: (date: Date) => {
      setTimeState((prev) => ({
        ...prev,
        nowDate: date,
        dayOfMonth: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
      }));
    },
    setDayOfMonth: (dateDiff: number) =>
      setTimeState((prev) => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + dateDiff);
        return {
          ...prev,
          nowDate: newDate,
          dayOfMonth: newDate.getDate(),
        };
      }),
    setHour: (hour: number) =>
      setTimeState((prev) => {
        const newDate = new Date(prev.nowDate);
        newDate.setHours(hour);
        return {
          ...prev,
          nowDate: newDate,
          hour: newDate.getHours(),
        };
      }),
    setMinute: (minute: number) =>
      setTimeState((prev) => {
        const newDate = new Date(prev.nowDate);
        newDate.setMinutes(minute);
        return {
          ...prev,
          nowDate: newDate,
          minute: newDate.getMinutes(),
        };
      }),
  };

  const formattedValues = {
    date: formatDate(timeState.nowDate, timeState.dayOfMonth),
    time: formatTime(timeState.hour, timeState.minute),
  };

  return {
    timeState,
    timeHandler,
    formattedValues,
  } as UseTimeSelectReturn;
};
