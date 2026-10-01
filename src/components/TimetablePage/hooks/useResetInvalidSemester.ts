import { useEffect } from 'react';

import { isSemesterInList } from 'utils/timetable/semester';
import { useSemester, useSemesterAction } from 'utils/zustand/semester';

import useSemesterOptionList from './useSemesterOptionList';

/** 저장된 학기가 목록에서 사라지면 첫 학기로 되돌린다. */
export default function useResetInvalidSemester() {
  const semester = useSemester();
  const { updateSemester } = useSemesterAction();
  const semesterOptionList = useSemesterOptionList();

  useEffect(() => {
    if (semesterOptionList.length === 0) return;
    if (isSemesterInList(semesterOptionList, semester)) return;
    updateSemester(semesterOptionList[0].value);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- semester/updateSemester를 넣으면 재실행이 무한루프를 유발함
  }, [semesterOptionList]);
}
