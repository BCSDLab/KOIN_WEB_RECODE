import { useEffect } from 'react';

import { isSemesterInList } from 'utils/timetable/semester';
import { useSemester, useSemesterAction } from 'utils/zustand/semester';

import useSemesterOptionList from './useSemesterOptionList';

/** 저장된 학기가 목록에서 사라지면 첫 학기로 되돌린다. */
export default function useResetInvalidSemester() {
  const semester = useSemester();
  const { updateSemester } = useSemesterAction();
  const semesterOptionList = useSemesterOptionList();

  // semester를 deps에서 빼면 안 된다. SSR 페이지의 하이드레이션 렌더에서는 스토어가 서버 스냅샷(기본 학기)을
  // 돌려주므로, 첫 실행만 보면 localStorage의 실제 저장 학기를 검사하지 못한다. 되돌린 학기는 목록에 있으므로
  // 다음 실행은 바로 반환해 반복되지 않는다.
  useEffect(() => {
    if (semesterOptionList.length === 0) return;
    if (isSemesterInList(semesterOptionList, semester)) return;
    updateSemester(semesterOptionList[0].value);
  }, [semesterOptionList, semester, updateSemester]);
}
