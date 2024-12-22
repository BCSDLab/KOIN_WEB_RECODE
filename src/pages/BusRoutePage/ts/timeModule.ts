export const formatDate = (now: Date, date: number) => (
  // yyyy-mm-dd 형식으로 반환
  `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`
);

export const formatTime = (hour: number, minute: number) => (
  `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
);
