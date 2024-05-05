import useTokenState from 'utils/hooks/useTokenState';
import { useLecturesState } from 'utils/zustand/myLectures';
import { useSemester } from 'utils/zustand/semester';
import useTimetableInfoList from './useTimetableInfoList';

export default function useMyLectures() {
  const token = useTokenState();
  const semester = useSemester();
  // const myLecturesFromLocalStorageValue = useRecoilValue(myLecturesAtom);
  const myLecturesFromLocalStorageValue = useLecturesState();
  const { data: myLecturesFromServer } = useTimetableInfoList(semester, token);

  const myLectures = token ? (myLecturesFromServer ?? []) : (myLecturesFromLocalStorageValue ?? []);

  return { myLectures };
}
