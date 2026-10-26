import type { Semester } from 'api/timetable/entity';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { useLecturesState } from 'utils/zustand/myLectures';
import { useSemester } from 'utils/zustand/semester';

import useTimetableInfoList from './useTimetableInfoList';

export default function useMyLectures(timetableFrameId: number, semesterOverride?: Semester) {
  const isLoggedIn = useIsLoggedIn();
  const storedSemester = useSemester();
  const semester = semesterOverride ?? storedSemester;
  const { data: myLecturesFromServer } = useTimetableInfoList({
    timetableFrameId,
  });
  const myLecturesFromLocalStorageValue = useLecturesState(`${semester?.year}${semester?.term}`);

  const myLectures = isLoggedIn ? myLecturesFromServer : myLecturesFromLocalStorageValue;

  return { myLectures };
}
