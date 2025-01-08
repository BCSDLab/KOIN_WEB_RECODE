import useTokenState from 'utils/hooks/state/useTokenState';
import { useLecturesState } from 'utils/zustand/myLectures';
import { useSemester } from 'utils/zustand/semester';
import _ from 'lodash';
import useTimetableInfoList from './useTimetableInfoList';

export default function useMyLectures(frameId: number) {
  const token = useTokenState();
  const semester = useSemester();
  console.log(`${semester?.year}${semester?.term}`);
  const { data: myLecturesFromServer } = useTimetableInfoList({
    authorization: token, timetableFrameId: frameId,
  });
  const myLecturesFromLocalStorageValue = useLecturesState(`${semester?.year}${semester?.term}`);

  const myLectures = (!_.isEmpty(myLecturesFromServer))
    ? myLecturesFromServer
    : myLecturesFromLocalStorageValue;
  return { myLectures };
}
