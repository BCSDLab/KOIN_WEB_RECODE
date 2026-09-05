const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

// 'YYYY-MM-DD' 형식이면서 실제 존재하는 달력 날짜인지 검증한다. (예: '2025-02-31'은 false)
const isValidCalendarDate = (value: string) => {
  if (!DATE_FORMAT.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

export default isValidCalendarDate;
