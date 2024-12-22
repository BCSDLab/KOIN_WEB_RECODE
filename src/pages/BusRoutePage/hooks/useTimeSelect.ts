import { useState } from 'react';
import { formatDate, formatTime } from 'pages/BusRoutePage/ts/timeModule';

interface TimeState {
  date: number;
  hour: number;
  minute: number;
}

interface TimeHandlers {
  setDate: (date: number) => void;
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
  const now = new Date();
  const [timeState, setTimeState] = useState({
    date: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
  });

  const formattedValues = {
    date: formatDate(now, timeState.date),
    time: formatTime(timeState.hour, timeState.minute),
  };

  const timeHandler = {
    setDate: (date: number) => setTimeState((prev) => ({ ...prev, date })),
    setHour: (hour: number) => setTimeState((prev) => ({ ...prev, hour })),
    setMinute: (minute: number) => setTimeState((prev) => ({ ...prev, minute })),
  };

  return {
    timeState,
    timeHandler,
    formattedValues,
  } as UseTimeSelectReturn;
};
