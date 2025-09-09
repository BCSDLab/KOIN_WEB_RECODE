import useTokenState from 'utils/hooks/state/useTokenState';
import { useLecturesState } from 'utils/zustand/myLectures';
import { useSemester } from 'utils/zustand/semester';
import useTimetableInfoList from './useTimetableInfoList';

export default function useMyLectures(timetableFrameId: number) {
  const token = useTokenState();
  const semester = useSemester();
  const { data: myLecturesFromServer } = useTimetableInfoList({
    authorization: token, timetableFrameId,
  });
  const myLecturesFromLocalStorageValue = useLecturesState(`${semester?.year}${semester?.term}`);

  const myLectures = token
    ? myLecturesFromServer
    : myLecturesFromLocalStorageValue;
  return { myLectures };
}
