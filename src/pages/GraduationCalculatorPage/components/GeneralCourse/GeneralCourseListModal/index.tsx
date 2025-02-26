import CloseIcon from 'assets/svg/close-icon-grey.svg';
import SemesterList from 'pages/TimetablePage/components/SemesterList';
import SemesterCourseTable from 'pages/GraduationCalculatorPage/components/CourseTable/SemesterCourseTable';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useSemester } from 'utils/zustand/semester';
import useCourseType from 'pages/GraduationCalculatorPage/hooks/useCourseType';
import styles from './GeneralCourseListModal.module.scss';

export interface GeneralCourseListModalProps {
  courseType: string | null;
  onClose: () => void;
}

function GeneralCourseListModal({
  courseType,
  onClose,
}: GeneralCourseListModalProps) {
  const token = useTokenState();
  const semester = useSemester();

  const { data: generalCourses } = useCourseType(token, semester, '교양선택', courseType ?? undefined);
  const generalCourseLectures = generalCourses?.lectures ?? [];

  const tableData = generalCourseLectures.map((lecture) => [
    <span>{lecture.name}</span>,
    <span>{ }</span>, // 개설 목록 테이블에서는 '교수명' 비활성화
    <span>{lecture.grades}</span>,
    <span>교양선택</span>,
    <span>{ }</span>, // 개설 목록 테이블에서는 '삭제 버튼' 비활성화
  ]);

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
          <SemesterCourseTable tableData={tableData} />
        </div>
      </div>
    </div>
  );
}

export default GeneralCourseListModal;
