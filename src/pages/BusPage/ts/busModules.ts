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

export const getStartTimeString = (second: number | '미운행' | undefined, isMain:boolean = false) => {
  if (!second) return '';
  if (second === '미운행') return '';

  const hour = getHour(second);
  const minute = getMinute(second);

  const today = new Date();

  let startHour = today.getHours() + hour;
  let startMinute = today.getMinutes() + minute;

  startHour %= 24;
  startMinute %= 60;
  const timeString = [String(startHour).padStart(2, '0'), String(startMinute).padStart(2, '0')];

  if (isMain) return `${timeString[0]}시 ${timeString[1]}분`;
  return `${timeString[0]}:${timeString[1]}`;
};

// eslint-disable-next-line consistent-return
export const directionToEnglish = (direction: string) => {
  if (direction === '한기대') return 'koreatech';
  if (direction === '야우리') return 'terminal';
  if (direction === '천안역') return 'station';
  return '';
};

export const getBusName = (busType: string) => {
  if (busType === 'shuttle') return '학교셔틀';
  if (busType === 'express') return '대성고속';
  if (busType === 'city') return '시내버스';
  return '';
};
