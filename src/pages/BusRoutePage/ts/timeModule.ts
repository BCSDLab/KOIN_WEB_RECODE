export const formatDate = (now: Date, date: number) => (
  // yyyy-mm-dd 형식으로 반환
  `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`
);

export const formatTime = (hour: number, minute: number) => (
  `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
);

export const getTimeDifference = (time1: string, time2: string) => { // HH:mm:ss
  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2.split(':').map(Number);

  const totalMinutes1 = hours1 * 60 + minutes1;
  const totalMinutes2 = hours2 * 60 + minutes2;

  const diffMinutes = Math.abs(totalMinutes1 - totalMinutes2);

  return {
    hours: Math.floor(diffMinutes / 60),
    minutes: diffMinutes % 60,
  };
};

export const formatTimeDifference = (time1: string, time2: string) => {
  const { hours, minutes } = getTimeDifference(time1, time2);

  if (hours === 0) {
    return `${minutes}분 전`;
  }

  return `${hours}시간 ${minutes > 0 ? `${minutes}분` : ''} 전`;
};
