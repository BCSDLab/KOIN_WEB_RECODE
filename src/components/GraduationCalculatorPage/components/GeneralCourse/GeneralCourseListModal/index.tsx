import CloseIcon from 'assets/svg/close-icon-grey.svg';
import SemesterCourseTable from 'components/GraduationCalculatorPage/components/CourseTable/SemesterCourseTable';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useSemester } from 'components/TimetablePage/hooks/useSemesterOptionList';
import useCourseType from 'components/GraduationCalculatorPage/hooks/useCourseType';
import { startTransition, useState } from 'react';
import { Selector } from 'components/ui/Selector';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
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
  const semesters = useSemester();
  const semesterOptionList = (semesters ?? []).map(
    (semesterInfo) => ({
      label: `${semesterInfo.year}년 ${semesterInfo.term}`,
      value: `${semesterInfo.year}년 ${semesterInfo.term}`,
    }),
  );
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });

  const [semester, setSemester] = useState<{
    year: number,
    term: string
  }>({ year: semesters[0].year, term: semesters[0].term });

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
    <div className={styles.background} ref={backgroundRef}>
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
        <div className={styles.header__semester}>
          <Selector
            options={semesterOptionList}
            value={`${semester.year}년 ${semester.term}`}
            onChange={({ target }) => startTransition(() => {
              setSemester({
                year: Number(target.value.slice(0, 4)),
                term: target.value.slice(6),
              });
            })}
            dropDownMaxHeight={384}
          />
        </div>
        <div className={styles.content}>
          <p className={styles.content__label}>{courseType}</p>
          <div className={styles.content__table}>
            <SemesterCourseTable tableData={tableData} hasProfessor={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralCourseListModal;
