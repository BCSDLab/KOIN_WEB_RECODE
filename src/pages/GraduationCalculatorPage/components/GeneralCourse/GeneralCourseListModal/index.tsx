import CloseIcon from 'assets/svg/close-icon-grey.svg';
import SemesterList from 'pages/TimetablePage/components/SemesterList';
import SemesterCourseTable from 'pages/GraduationCalculatorPage/components/CourseTable/SemesterCourseTable';
import styles from './GeneralCourseListModal.module.scss';

export interface GeneralCourseListModalProps {
  frameId: number;
  onClose: () => void;
}

function GeneralCourseListModal({
  frameId,
  onClose,
}: GeneralCourseListModalProps) {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.header__title}>학기 교양 개설 목록</p>
          {/* eslint-disable jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            onClick={onClose}
            className={styles['header__close-button']}
          >
            <CloseIcon />
          </button>
        </div>
        <SemesterList />
        <div className={styles.content}>
          <p className={styles.content__label}>강의 영역 이름</p>
          <SemesterCourseTable frameId={frameId} />
        </div>
      </div>
    </div>
  );
}

export default GeneralCourseListModal;
