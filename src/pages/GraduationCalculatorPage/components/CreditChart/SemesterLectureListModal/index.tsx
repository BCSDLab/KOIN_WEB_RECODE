import Listbox from 'components/TimetablePage/Listbox';
import SemesterCourseTable from 'pages/GraduationCalculatorPage/components/CourseTable/SemesterCourseTable';
import { useSemester } from 'pages/TimetablePage/hooks/useSemesterOptionList';
import useSelect from 'pages/TimetablePage/hooks/useSelect';
import DeptListbox from 'pages/TimetablePage/components/LectureList/DeptListbox';
import CloseIcon from 'assets/svg/close-icon-grey.svg';
import useTokenState from 'utils/hooks/state/useTokenState';
import useCourseType from 'pages/GraduationCalculatorPage/hooks/useCourseType';
import { startTransition, useState } from 'react';
import { useUser } from 'utils/hooks/state/useUser';
import styles from './SemesterLectureListModal.module.scss';

const lectureStatusOptions = [
  {
    label: '수강한 강의',
    value: '수강한 강의',
  },
  {
    label: '미수강 강의',
    value: '미수강 강의',
  },
];

const courseType = [
  { label: '교양필수', value: '교양필수' },
  { label: '교양선택', value: '교양선택' },
  { label: '전공필수', value: '전공필수' },
  { label: '전공선택', value: '전공선택' },
  { label: 'MSC필수', value: 'MSC필수' },
  { label: 'MSC선택', value: 'MSC선택' },
  { label: 'HRD필수', value: 'HRD필수' },
  { label: 'HRD선택', value: 'HRD선택' },
  { label: '자유선택', value: '자유선택' },
  { label: '다전공', value: '다전공' },
];

export default function SemesterLectureListModal({
  onClose,
  initialCourse,
}: {
  onClose: () => void,
  initialCourse: string,
}) {
  const semesters = useSemester();
  const token = useTokenState();
  const { data: userInfo } = useUser();
  const semesterOptionList = (semesters ?? []).map(
    (semesterInfo) => ({
      label: `${semesterInfo.year}년 ${semesterInfo.term}`,
      value: `${semesterInfo.year}년 ${semesterInfo.term}`,
    }),
  );

  const [semester, setSemester] = useState<{
    year: number,
    term: string
  }>({ year: semesters[0].year, term: semesters[0].term });
  const {
    value: lectureStatus, onChangeSelect: onChangeLectureStatus,
  } = useSelect(lectureStatusOptions[0].value);
  const { value: department, onChangeSelect: onChangeDepartment } = useSelect(userInfo?.major);
  const { value: course, onChangeSelect: onChangeCourse } = useSelect(initialCourse);
  const { data: generalCourses } = useCourseType(token, semester, course!);

  const filteredLecturesByDept = department === '전체'
    ? generalCourses.lectures
    : generalCourses.lectures.filter(
      (lecture) => lecture.department === department,
    );

  const tableData = filteredLecturesByDept.map((lecture) => [
    <span key={`name-${lecture.id}`}>{lecture.name}</span>,
    <span key={`professor-${lecture.id}`}>{}</span>,
    <span key={`grades-${lecture.id}`}>{lecture.grades}</span>,
    <span key={`grades-${lecture.id}`}>{course}</span>,
  ]);

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.container__header}>
          <div className={styles['container__header--title']}>학기 강의 개설 목록</div>
          <button type="button" aria-label="닫기" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.dropdowns}>
          <Listbox
            list={semesterOptionList}
            value={`${semester.year}년 ${semester.term}`}
            onChange={({ target }) => startTransition(() => {
              setSemester({
                year: Number(target.value.slice(0, 4)),
                term: target.value.slice(6),
              });
            })}
            version="new"
          />
          <Listbox
            list={lectureStatusOptions}
            value={lectureStatus}
            onChange={(e) => {
              startTransition(() => {
                onChangeLectureStatus(e);
              });
            }}
            version="new"
          />
          <DeptListbox
            value={department}
            onChange={(e) => {
              startTransition(() => {
                onChangeDepartment(e);
              });
            }}
          />
          <Listbox
            list={courseType}
            value={course}
            onChange={(e) => {
              startTransition(() => {
                onChangeCourse(e);
              });
            }}
            version="new"
          />
        </div>
        <SemesterCourseTable
          tableData={tableData}
        />
      </div>
    </div>
  );
}
