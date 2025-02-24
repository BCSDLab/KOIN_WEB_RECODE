import CloseIcon from 'assets/svg/close-icon-grey.svg';
import SemesterList from 'pages/TimetablePage/components/SemesterList';
import SemesterCourseTable from 'pages/GraduationCalculatorPage/components/CourseTable/SemesterCourseTable';
import styles from './GeneralCourseListModal.module.scss';

export interface GeneralCourseListModalProps {
  frameId: number;
  courseType: string | null;
  onClose: () => void;
}

function GeneralCourseListModal({
  frameId,
  courseType,
  onClose,
}: GeneralCourseListModalProps) {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.header__title}>학기 교양 개설 목록</p>
          <button
            type="button"
            onClick={onClose}
            className={styles['header__close-button']}
            aria-label="닫기 버튼"
          >
            <CloseIcon />
          </button>
        </div>
        <SemesterList isViewMode />
        <div className={styles.content}>
          <p className={styles.content__label}>{courseType}</p>
          <SemesterCourseTable
            frameId={frameId}
            courseType={courseType}
            isViewMode
          />
        </div>
      </div>
    </div>
  );
}

export default GeneralCourseListModal;
