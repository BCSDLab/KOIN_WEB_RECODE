import React from 'react';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import styles from './DeleteSemesterModal.module.scss';

export interface DeleteSemesterModalProps {
  onClose: () => void
  handleDeleteSemester: () => void
}

export default function DeleteSemesterModal({
  onClose,
  handleDeleteSemester,
}: DeleteSemesterModalProps) {
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
            onClick={handleDeleteSemester}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
