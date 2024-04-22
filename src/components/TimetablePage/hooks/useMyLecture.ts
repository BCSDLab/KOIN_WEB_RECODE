import { useRecoilValue } from 'recoil';
import useTokenState from 'utils/hooks/useTokenState';
import { myLecturesAtom, selectedSemesterAtom } from 'utils/recoil/semester';
import useTimetableInfoList from './useTimetableInfoList';

export default function useMyLecture() {
  const token = useTokenState();
  const selectedSemester = useRecoilValue(selectedSemesterAtom);
  const myLecturesFromLocalStorageValue = useRecoilValue(myLecturesAtom);
  const { data: myLecturesFromServer } = useTimetableInfoList(selectedSemester, token);

  const myLectures = token ? (myLecturesFromServer ?? []) : (myLecturesFromLocalStorageValue ?? []);

  return { myLectures };
}
