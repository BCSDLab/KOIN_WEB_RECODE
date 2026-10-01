import type { Semester, Term } from 'api/timetable/entity';

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

const TERM_ORDER: Record<Term, number> = { '1학기': 0, 여름학기: 1, '2학기': 2, 겨울학기: 3 };

/** 최신 학기 순으로 정렬한 새 배열 (같은 해는 겨울 → 2학기 → 여름 → 1학기). */
export function sortSemestersNewestFirst(semesters: Semester[]): Semester[] {
  return [...semesters].sort((a, b) => b.year - a.year || TERM_ORDER[b.term] - TERM_ORDER[a.term]);
}

/** 선택된 학기가 아직 선택 가능한 목록에 있는지. 없으면 목록의 첫 학기로 되돌려야 한다. */
export function isSemesterInList(semesterOptionList: Array<{ value: Semester }>, semester: Semester): boolean {
  return semesterOptionList.some(
    (option) => option.value.year === semester.year && option.value.term === semester.term,
  );
}
