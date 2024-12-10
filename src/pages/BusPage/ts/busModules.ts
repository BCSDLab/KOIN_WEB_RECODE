import { Course } from 'api/bus/entity';

// 시간 반환 함수
const getHour = (second: number) => Math.floor(second / 60 / 60) % 24;

const getMinute = (second: number) => Math.floor(second / 60) % 60;

export const getLeftTimeString = (second: number | '미운행' | undefined) => {
  if (second === undefined) {
    return '운행정보없음';
  }

  if (second === '미운행') {
    return '미운행';
  }

  if (getHour(second) === 0 && getMinute(second) === 0) {
    return '곧 도착';
  }

  if (getHour(second) === 0) {
    return `${getMinute(second)}분 전`;
  }

  return `${getHour(second)}시간 ${getMinute(second)}분 전`;
};

export const getStartTimeString = (second: number | '미운행' | undefined, isMain: boolean = false) => {
  if (!second) return '';
  if (second === '미운행') return '';

  const today = (new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000);
  const arrivalTimeSecond = Math.ceil(today / 1000) + second;

  const hour = getHour(arrivalTimeSecond);
  const minute = getMinute(arrivalTimeSecond);

  const timeString = [String(hour).padStart(2, '0'), String(minute).padStart(2, '0')];

  if (isMain) return `${timeString[0]}시 ${timeString[1]}분`;
  return `${timeString[0]}:${timeString[1]}`;
};

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

export const getCourseName = (course: Course) => {
  let name = course.region;
  if (course.bus_type === 'shuttle') name += ' 셔틀';
  if (course.direction === 'to') name += ' 등교';
  if (course.direction === 'from') name += ' 하교';
  return name;
};
