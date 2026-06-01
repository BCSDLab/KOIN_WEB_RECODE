import { Semester, Term } from 'api/timetable/entity';

type QueryValue = string | string[] | undefined;

const TERMS = new Set<string>(['1학기', '여름학기', '2학기', '겨울학기']);

export function isTimetableTerm(term: QueryValue): term is Term {
  return typeof term === 'string' && TERMS.has(term);
}

export function getSemesterFromQuery(year: QueryValue, term: QueryValue): Semester | null {
  if (typeof year !== 'string' || !isTimetableTerm(term)) return null;

  const parsedYear = Number(year);
  if (!Number.isInteger(parsedYear)) return null;

  return {
    year: parsedYear,
    term,
  };
}

export function resolveTimetableSemester(year: QueryValue, term: QueryValue, userSemester?: Semester): Semester | null {
  const querySemester = getSemesterFromQuery(year, term);
  if (querySemester) return querySemester;
  if (userSemester) return userSemester;
  return null;
}

export function getRecentSemester(): Semester {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (month < 2) {
    return {
      year: year - 1,
      term: '겨울학기',
    };
  }
  if (month < 6) {
    return {
      year,
      term: '1학기',
    };
  }
  if (month < 8) {
    return {
      year,
      term: '여름학기',
    };
  }
  if (month < 13) {
    return {
      year,
      term: '2학기',
    };
  }

  return {
    year,
    term: '1학기',
  };
}
