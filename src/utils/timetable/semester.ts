import { Semester, Term } from 'api/timetable/entity';

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
