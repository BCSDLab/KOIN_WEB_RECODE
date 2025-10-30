export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (inputDate.getTime() === today.getTime()) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours < 12 ? '오전' : '오후';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${period} ${formattedHours}:${formattedMinutes}`;
  }

  if (inputDate.getTime() === yesterday.getTime()) {
    return '어제';
  }

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}월 ${day}일`;
}

export const formatISODateToMonthAndDay = (timestamp: string): string => {
  const date = new Date(timestamp);
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}월 ${date.getDate().toString().padStart(2, '0')}일`;
};

export const formatISODateToTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export const getKoreaISODate = () => {
  const TIME_DIFFERENCE = 9;
  const date = new Date();
  date.setHours(date.getHours() + TIME_DIFFERENCE);
  return date.toISOString();
};
