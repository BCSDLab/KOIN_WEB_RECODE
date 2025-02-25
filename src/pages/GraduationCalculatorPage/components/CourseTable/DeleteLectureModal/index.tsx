import CloseIcon from 'assets/svg/close-icon-black.svg';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './DeleteLectureModal.module.scss';

export interface DeleteLectureModalProps {
  onClose: () => void;
  handleDeleteLecture: () => void;
  setModalOpenFalse: () => void;
}

function DeleteLectureModal({
  onClose,
  handleDeleteLecture,
  setModalOpenFalse,
}: DeleteLectureModalProps) {
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });

  const closeModal = () => {
    setModalOpenFalse();
    onClose();
  };

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.container}>
        <header className={styles.container__header}>
          <span className={styles.container__title}>강의를 삭제하시겠습니까?</span>
          <div
            className={styles['container__close-button']}
            onClick={closeModal}
            role="button"
            aria-hidden
          >
            <CloseIcon />
          </div>
        </header>
        <div className={styles.container__instructions}>삭제한 강의는 복구가 불가능합니다.</div>
        <div className={styles.container__button}>
          <button
            type="button"
            className={styles['container__button--cancel']}
            onClick={closeModal}
          >
            취소하기
          </button>
          <button
            type="button"
            className={styles['container__button--delete']}
            onClick={() => {
              handleDeleteLecture();
              setModalOpenFalse();
            }}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteLectureModal;
