import useTokenState from 'utils/hooks/useTokenState';
import { useLecturesState } from 'utils/zustand/myLecturesV2';
import useTimetableV2InfoList from './useTimetableV2InfoList';

export default function useMyLecturesV2(frameId: number) {
  const token = useTokenState();
  const myLecturesFromLocalStorageValue = useLecturesState(frameId);
  const { data: myLecturesFromServer } = useTimetableV2InfoList(frameId, token);

  const myLecturesV2 = token
    ? (myLecturesFromServer ?? [])
    : (myLecturesFromLocalStorageValue ?? []);

  return { myLecturesV2 };
}
