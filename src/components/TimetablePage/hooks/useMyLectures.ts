import useTokenState from 'utils/hooks/state/useTokenState';
import { useLecturesState } from 'utils/zustand/myLectures';
import { useSemester } from 'utils/zustand/semester';
import useTimetableInfoList from './useTimetableInfoList';
import type { Semester } from 'api/timetable/entity';

export default function useMyLectures(timetableFrameId: number, semesterOverride?: Semester) {
  const token = useTokenState();
  const storedSemester = useSemester();
  const semester = semesterOverride ?? storedSemester;
  const { data: myLecturesFromServer } = useTimetableInfoList({
    authorization: token,
    timetableFrameId,
  });
  const myLecturesFromLocalStorageValue = useLecturesState(`${semester?.year}${semester?.term}`);

  const myLectures = token ? myLecturesFromServer : myLecturesFromLocalStorageValue;
  return { myLectures };
}
