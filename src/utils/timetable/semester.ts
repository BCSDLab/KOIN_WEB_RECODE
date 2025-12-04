/**
 * 시간표 도메인 - 학기 유틸리티
 * SSR에서 zustand 대신 사용하는 getRecentSemester
 */

import { Semester, Term } from 'api/timetable/entity';

/**
 * 현재 학기를 계산하여 반환합니다.
 * (zustand에 동일한 로직이 있지만, SSR에서는 zustand를 못 쓰므로 별도 분리)
 */
export function getRecentSemester(): Semester {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (month < 2) {
    return {
      year: year - 1,
      term: '겨울학기' as Term,
    };
  }
  if (month < 6) {
    return {
      year,
      term: '1학기' as Term,
    };
  }
  if (month < 8) {
    return {
      year,
      term: '여름학기' as Term,
    };
  }
  if (month < 13) {
    return {
      year,
      term: '2학기' as Term,
    };
  }

  return {
    year,
    term: '1학기' as Term,
  };
}
