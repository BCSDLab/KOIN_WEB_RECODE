import SemesterCourseTable from 'pages/GraduationCalculatorPage/components/CourseTable/SemesterCourseTable';
import { useSemester } from 'pages/TimetablePage/hooks/useSemesterOptionList';
import useSelect from 'pages/TimetablePage/hooks/useSelect';
import DeptListbox from 'pages/TimetablePage/components/LectureList/DeptListbox';
import CloseIcon from 'assets/svg/close-icon-grey.svg';
import useTokenState from 'utils/hooks/state/useTokenState';
import useCourseType from 'pages/GraduationCalculatorPage/hooks/useCourseType';
import { startTransition, useState } from 'react';
import useUserAcademicInfo from 'utils/hooks/state/useUserAcademicInfo';
import useAllMyLectures from 'pages/TimetablePage/hooks/useAllMyLectures';
import { LectureInfo } from 'api/graduationCalculator/entity';
import { Selector } from 'components/common/Selector';
import _ from 'lodash';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
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
  const allMyLectures = useAllMyLectures(token);
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  const { data: academicInfo } = useUserAcademicInfo();
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
  const {
    value: department,
    onChangeSelect: onChangeDepartment,
  } = useSelect(academicInfo?.department);
  const { value: course, onChangeSelect: onChangeCourse } = useSelect(initialCourse);
  const { data: generalCourses } = useCourseType(token, semester, course!);

  const allMyLecturesInfo = allMyLectures
    .filter((myLecture) => myLecture.course_type === course)
    .map((lecture) => ({
      ..._.pick(lecture, ['id', 'code', 'professor', 'grades', 'department']),
      name: lecture.class_title,
    }));

  const lecturesInfo = lectureStatus === '수강한 강의'
    ? allMyLecturesInfo
    : generalCourses.lectures;

  const filteredLecturesByDept = department === '전체'
    ? lecturesInfo
    : lecturesInfo.filter(
      (lecture) => lecture.department === department,
    );

  function separateByMatchingCodes(lectureInfo: LectureInfo[], takenCode: string[]) {
    const codesSet2 = new Set(takenCode);

    const matched = [
      ...lectureInfo.filter((item) => codesSet2.has(item.code)),
    ];
    const unmatched = [
      ...lectureInfo.filter((item) => !codesSet2.has(item.code)),
    ];

    return { matched, unmatched };
  }

  const filteredLectureByLectureStatus = lectureStatus === '수강한 강의'
    ? separateByMatchingCodes(
      filteredLecturesByDept,
      allMyLectures.map((item) => item.code),
    ).matched
    : separateByMatchingCodes(
      filteredLecturesByDept,
      allMyLectures.map((item) => item.code),
    ).unmatched;

  const tableData = filteredLectureByLectureStatus.map((lecture) => [
    <span>{lecture.name}</span>,
    <span>{lecture.professor ? lecture.professor : ''}</span>,
    <span>{lecture.grades}</span>,
    <span>{course}</span>,
    <span>{ }</span>,
  ]);

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.container}>
        <div className={styles.container__header}>
          <div className={styles['container__header--title']}>학기 강의 개설 목록</div>
          <button type="button" aria-label="닫기" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.dropdowns}>
          <div className={styles['dropdowns__first-row']}>
            <Selector
              options={semesterOptionList}
              value={lectureStatus === '수강한 강의' ? '' : `${semester.year}년 ${semester.term}`}
              onChange={({ target }) => startTransition(() => {
                setSemester({
                  year: Number(target.value.slice(0, 4)),
                  term: target.value.slice(6),
                });
              })}
              dropDownMaxHeight={406}
              placeholder="-"
              disabled={lectureStatus === '수강한 강의'}
            />
          </div>
          <div className={styles['dropdowns__first-row']}>
            <Selector
              options={lectureStatusOptions}
              value={lectureStatus}
              onChange={(e) => {
                startTransition(() => {
                  onChangeLectureStatus(e);
                });
              }}
            />
          </div>
          <div className={styles['dropdowns__second-row']}>
            <DeptListbox
              value={department}
              onChange={(e) => {
                startTransition(() => {
                  onChangeDepartment(e);
                });
              }}
              dropDownMaxHeight={345}
            />
          </div>
          <div className={styles['dropdowns__second-row']}>
            <Selector
              options={courseType}
              value={course}
              onChange={(e) => {
                startTransition(() => {
                  onChangeCourse(e);
                });
              }}
              dropDownMaxHeight={345}
            />
          </div>
        </div>
        <div className={styles['container__lecture-table']}>
          <SemesterCourseTable
            tableData={tableData}
            hasProfessor={lectureStatus === '수강한 강의'}
          />
        </div>
      </div>
    </div>
  );
}
