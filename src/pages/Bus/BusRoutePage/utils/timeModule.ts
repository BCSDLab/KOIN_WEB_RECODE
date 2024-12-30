export const formatDate = (now: Date, date: number) => ( // yyyy-mm-dd
  `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`
);

export const formatTime = (hour: number, minute: number) => ( // HH:mm
  `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
);

export const formatTimeWithSeconds = (date: Date) => { // HH:mm:ss
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
};

export const formatRelativeDate = (date: Date) => { // ex. 오늘 or 7월 9일
  const now = new Date();

  if (now.getDate() === date.getDate()) return '오늘';
  return `${(date.getMonth() + 1)}월 ${date.getDate()}일`;
};

export const format12Hour = (date: Date) => { // ex. 오전 01:01
  const hour = date.getHours();
  const minute = date.getMinutes();

  const period = hour >= 12 ? '오후' : '오전';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${period} ${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const getTimeDifference = (time1: string, time2: string) => {
  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2.split(':').map(Number);

  const totalMinutes1 = hours1 * 60 + minutes1;
  const totalMinutes2 = hours2 * 60 + minutes2;

  const diffMinutes = totalMinutes1 - totalMinutes2;

  return {
    hours: Math.floor(Math.abs(diffMinutes) / 60),
    minutes: Math.abs(diffMinutes) % 60,
    isPast: diffMinutes < 0,
  };
};

export const formatTimeDifference = (time1: string, time2: string) => {
  const { hours, minutes, isPast } = getTimeDifference(time1, time2);

  if (isPast) return '';

  if (hours === 0) return `${minutes}분 전`;
  return `${hours}시간 ${minutes > 0 ? `${minutes}분` : ''} 전`;
};
