import CloseIcon from 'assets/svg/close-icon-grey.svg';
import styles from './GeneralCourseListModal.module.scss';

function GeneralCourseListModal({ closeInfo }: { closeInfo: () => void }) {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.header__title}>학기 교양 개설 목록</p>
          {/* eslint-disable jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            onClick={closeInfo}
            className={styles['header__close-button']}
          >
            <CloseIcon />
          </button>
        </div>
        <p>SemesterList</p>
        <div className={styles.content}>
          <p className={styles.content__label}>강의 영역 이름</p>
          <p>SemesterCourseTable</p>
        </div>
      </div>
    </div>
  );
}

export default GeneralCourseListModal;
