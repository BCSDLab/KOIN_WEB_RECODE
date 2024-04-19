/* eslint-disable no-restricted-imports */
import LoadingSpinner from 'components/common/LoadingSpinner';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useTokenState from 'utils/hooks/useTokenState';
import { myLectureRemoveLectureSelector, myLecturesAtom, selectedSemesterAtom } from 'utils/recoil/semester';
import useDeleteTimetableLecture from '../hooks/useDeleteTimetableLecture';
import useTimetableInfoList from '../hooks/useTimetableInfoList';
import LectureTable from '../LectureTable';
import styles from './DefaultPage.module.scss';

function CurrentMyLectureList() {
  const myLecturesValue = useRecoilValue(myLecturesAtom);
  const removeLectureFromLocalStorage = useSetRecoilState(myLectureRemoveLectureSelector);

  const selectedSemester = useRecoilValue(selectedSemesterAtom);
  const token = useTokenState();
  const { data: myLecturesFromServer } = useTimetableInfoList(selectedSemester, token);
  const { mutate: removeLectureFromServer } = useDeleteTimetableLecture(selectedSemester, token);

  return (
    (myLecturesValue !== null || myLecturesFromServer !== undefined) ? (
      <LectureTable
        height={300}
        list={token ? (myLecturesFromServer ?? []) : (myLecturesValue ?? [])}
        selectedLecture={undefined}
        onClickRow={undefined}
        onClickLastColumn={
        (clickedLecture) => {
          if ('name' in clickedLecture) {
            removeLectureFromLocalStorage(clickedLecture);
            return;
          }
          removeLectureFromServer(clickedLecture.id.toString());
        }
      }
      >
        {(props: { onClick: () => void }) => (
          <button type="button" className={styles.list__button} onClick={props.onClick}>
            <img src="https://static.koreatech.in/assets/img/ic-delete.png" alt="제거" />
          </button>
        )}
      </LectureTable>
    ) : (
      <LoadingSpinner size="50" />
    ));
}

export default CurrentMyLectureList;
