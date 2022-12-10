// 시간 반환 함수
const getHour = (second: number) => Math.floor(second / 60 / 60);

const getMinute = (second: number) => Math.ceil(second / 60) % 60;

export const getLeftTimeString = (second: number | '미운행' | undefined) => {
  if (!second) {
    return '운행정보없음';
  } if (second === '미운행') {
    return '미운행';
  } if (getHour(second) === 0 && getMinute(second) === 0) {
    return '곧 도착';
  } if (getHour(second) === 0) {
    return `${getMinute(second)}분 전`;
  } return `${getHour(second)}시간 ${getMinute(second)}분 전`;
};

export const getStartTimeString = (second: number) => {
  const hour = getHour(second);
  const minute = getMinute(second);

  const today = new Date();

  let startHour = today.getHours() + hour;
  let startMinute = today.getMinutes() + minute;

  startHour %= 24;
  startMinute %= 60;

  return `${String(startHour).padStart(2, '0')}시 ${String(startMinute).padStart(2, '0')}분`;
};

// eslint-disable-next-line consistent-return
export const directionToEnglish = (direction: string) => {
  if (direction === '한기대') return 'koreatech';
  if (direction === '야우리') return 'terminal';
  if (direction === '천안역') return 'station';
  return '';
};
