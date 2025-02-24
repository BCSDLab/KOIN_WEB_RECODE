/* eslint-disable jsx-a11y/control-has-associated-label */
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import useTimetableMutation from 'pages/TimetablePage/hooks/useTimetableMutation';
import { Lecture, MyLectureInfo } from 'api/timetable/entity';
import { LectureInfo } from 'api/graduationCalculator/entity';
import CourseTypeList from 'pages/GraduationCalculatorPage/components/CourseTable/CourseTypeList';
import CloseIcon from 'assets/svg/modal-close-icon.svg';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useSemester } from 'utils/zustand/semester';
import useCourseType from 'pages/GraduationCalculatorPage/hooks/useCourseType';
import styles from './SemesterCourseTable.module.scss';

export interface SemesterCourseTableProps {
  frameId: number;
  courseType?: string | null;
  isViewMode?: boolean;
}

function SemesterCourseTable({
  frameId,
  courseType,
  isViewMode,
}: SemesterCourseTableProps) {
  const token = useTokenState();
  const { removeMyLecture } = useTimetableMutation(frameId);
  const { myLectures }: { myLectures: (MyLectureInfo | Lecture)[] } = useMyLectures(frameId);
  const { editMyLecture } = useTimetableMutation(frameId);
  const semester = useSemester();

  const { data: generalCourses } = useCourseType(token, semester, '교양선택', courseType ?? undefined);
  const generalCourseLectures = generalCourses?.lectures ?? [];

  const filteredMyLectures = (myLectures as MyLectureInfo[])
    .filter((lecture: MyLectureInfo) => lecture.lecture_id !== null);

  const handleCourseTypeChange = (id: number, newCourseType: string) => {
    const targetLecture = filteredMyLectures.find((lecture) => lecture.id === id) as MyLectureInfo;

    if (!targetLecture) return;
    editMyLecture({
      ...targetLecture,
      class_places: [
        { class_place: '' },
      ],
      course_type: newCourseType,
    });
  };

  const onClickDeleteLecture = (id: number) => {
    const lectureToRemove = myLectures.find(
      (lecture: MyLectureInfo | Lecture) => lecture.id === id,
    );

    if (!lectureToRemove) return;

    removeMyLecture.mutate({ clickedLecture: lectureToRemove, id });
  };

  return (
    <table className={styles.table}>
      <thead className={styles.table__header}>
        <tr>
          <th>과목명</th>
          <th>교수명</th>
          <th>학점</th>
          <th>이수구분</th>
          <th>{' '}</th>
        </tr>
      </thead>
      <tbody className={styles.table__body}>
        {isViewMode
          ? generalCourseLectures.map((lecture: LectureInfo) => (
            <tr key={lecture.id}>
              <td>
                <span>{lecture.name}</span>
              </td>
              <td>
                <span>{ }</span>
              </td>
              <td>{lecture.grades}</td>
              <td>
                <span>교양선택</span>
              </td>
              <td>
                <span>{ }</span>
              </td>
            </tr>
          ))
          : filteredMyLectures.map((lecture: MyLectureInfo) => (
            <tr key={lecture.id}>
              <td>
                <span>{lecture.class_title}</span>
              </td>
              <td>
                <span>{lecture.professor}</span>
              </td>
              <td>{lecture.grades}</td>
              <td>
                <CourseTypeList
                  courseTypeDefault={lecture.course_type}
                  id={lecture.id}
                  onCourseTypeChange={handleCourseTypeChange}
                />
              </td>
              <td>
                <button type="button" onClick={() => onClickDeleteLecture(lecture.id)}>
                  <CloseIcon />
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default SemesterCourseTable;
