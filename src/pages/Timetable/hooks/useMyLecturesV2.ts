import useTokenState from 'utils/hooks/useTokenState';
import { useLecturesState } from 'utils/zustand/myLecturesV2';
import { useSemester } from 'utils/zustand/semester';
import useTimetableV2InfoList from './useTimetableV2InfoList';

export default function useMyLecturesV2(frameId: number) {
  const token = useTokenState();
  const semester = useSemester();
  const myLecturesFromLocalStorageValue = useLecturesState(semester);
  const { data: myLecturesFromServer } = useTimetableV2InfoList(frameId, token);

  const myLecturesV2 = token
    ? (myLecturesFromServer ?? [])
    : (myLecturesFromLocalStorageValue ?? []);

  return { myLecturesV2 };
}
