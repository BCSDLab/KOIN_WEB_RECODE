import { useEffect } from 'react';
import useTokenState from 'utils/hooks/useTokenState';
import { useLecturesState } from 'utils/zustand/myLectures';
import { useSemester, useSemesterAction } from 'utils/zustand/semester';
import useTimetableInfoList from './useTimetableInfoList';

export default function useMyLectures() {
  const token = useTokenState();
  const semester = useSemester();
  // 현재 학기를 선택하지 못하므로 임시로 2024-1로 설정
  const { updateSemester } = useSemesterAction();
  useEffect(() => {
    updateSemester('20241');
  }, [updateSemester]);
  const myLecturesFromLocalStorageValue = useLecturesState();
  const { data: myLecturesFromServer } = useTimetableInfoList(semester, token);

  const myLectures = token ? (myLecturesFromServer ?? []) : (myLecturesFromLocalStorageValue ?? []);

  return { myLectures };
}
