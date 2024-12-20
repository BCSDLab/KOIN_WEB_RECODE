import { useState } from 'react';

export const useTimeSelect = () => {
  const now = new Date();
  const [timeState, setTimeState] = useState({
    date: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
  });

  const handlers = {
    setDate: (date: number) => setTimeState((prev) => ({ ...prev, date })),
    setHour: (hour: number) => setTimeState((prev) => ({ ...prev, hour })),
    setMinute: (minute: number) => setTimeState((prev) => ({ ...prev, minute })),
  };

  return {
    timeState,
    handlers,
  };
};
