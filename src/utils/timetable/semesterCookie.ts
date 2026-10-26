import type { Semester } from 'api/timetable/entity';
import { TIMETABLE_SEMESTER_COOKIE_KEY } from 'static/url';
import { getSemesterFromQuery } from 'utils/timetable/semester';
import { getCookieDomain, setCookie } from 'utils/ts/cookie';

const SEPARATOR = '-';
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** 선택 학기를 서버도 읽을 수 있게 쿠키에 미러링한다. 원본은 zustand 스토어(localStorage)다. */
export function writeSemesterCookie({ year, term }: Semester) {
  setCookie(TIMETABLE_SEMESTER_COOKIE_KEY, `${year}${SEPARATOR}${term}`, {
    maxAge: ONE_YEAR_SECONDS,
    domain: getCookieDomain(),
  });
}

/** 쿠키 원문은 신뢰할 수 없으므로 형식이 어긋나면 null로 취급한다. */
export function parseSemesterCookie(value: string | undefined): Semester | null {
  if (!value) return null;

  const separatorIndex = value.indexOf(SEPARATOR);
  if (separatorIndex < 0) return null;

  return getSemesterFromQuery(value.slice(0, separatorIndex), value.slice(separatorIndex + 1));
}
