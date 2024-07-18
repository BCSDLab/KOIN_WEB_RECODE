import React from 'react';
import useGetTimetableFrame from 'pages/Timetable/hooks/useGetTimetableFrame';
import useDeleteTimetableFrame from 'pages/Timetable/hooks/useDeleteTimetableFrame';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import styles from './DeleteSemesterModal.module.scss';

export interface DeleteSemesterModalProps {
  onClose: () => void
  token: string
  semester: string
}

export default function DeleteSemesterModal({
  onClose,
  token,
  semester,
}: DeleteSemesterModalProps) {
  const { data: timetableFrame } = useGetTimetableFrame(token, semester);
  const { mutate: deleteTimetableFrame } = useDeleteTimetableFrame(token, semester);
  const deleteSemester = () => {
    if (timetableFrame) {
      console.log(timetableFrame);
      timetableFrame.map((frame) => (
        !frame.is_main && (
          deleteTimetableFrame(frame.id)
        )
      ));
    }
    console.log(timetableFrame);
  };

  return (
    <div className={styles.background} aria-hidden>
      <div className={styles.container}>
        <header className={styles.container__header}>
          <span className={styles.container__title}>학기를 삭제하시겠습니까?</span>
          <CloseIcon className={styles['container__close-button']} onClick={onClose} />
        </header>
        <div className={styles.container__instructions}>삭제한 학기는 복구가 불가능합니다.</div>
        <div className={styles.container__button}>
          <button
            type="button"
            className={styles['container__button--cancel']}
            onClick={onClose}
          >
            취소하기
          </button>
          <button
            type="button"
            className={styles['container__button--delete']}
            onClick={deleteSemester}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
