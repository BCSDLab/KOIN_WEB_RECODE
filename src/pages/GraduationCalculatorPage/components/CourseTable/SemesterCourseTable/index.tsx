/* eslint-disable jsx-a11y/control-has-associated-label */
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import useTimetableMutation from 'pages/TimetablePage/hooks/useTimetableMutation';
import { Lecture, MyLectureInfo } from 'api/timetable/entity';
import CourseTypeList from 'pages/GraduationCalculatorPage/components/CourseTable/CourseTypeList';
import CloseIcon from 'assets/svg/modal-close-icon.svg';
import styles from './SemesterCourseTable.module.scss';

export interface SemesterCourseTableProps {
  frameId: number;
  isViewMode?: boolean;
}

function SemesterCourseTable({
  frameId,
  isViewMode,
}: SemesterCourseTableProps) {
  const { removeMyLecture } = useTimetableMutation(frameId);
  const { myLectures }: { myLectures: (MyLectureInfo | Lecture)[] } = useMyLectures(frameId);
  const { editMyLecture } = useTimetableMutation(frameId);

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
        {filteredMyLectures.map((lecture: MyLectureInfo) => (
          <tr key={lecture.id}>
            <td>
              <span>{lecture.class_title}</span>
            </td>
            <td>
              <span>{lecture.professor}</span>
            </td>
            <td>{lecture.grades}</td>
            <td>
              {isViewMode ? (
                <span>{lecture.course_type}</span>
              ) : (
                <CourseTypeList
                  courseTypeDefault={lecture.course_type}
                  id={lecture.id}
                  onCourseTypeChange={handleCourseTypeChange}
                />
              )}
            </td>
            <td>
              {isViewMode ? (
                <span>{ }</span>
              ) : (
                <button
                  type="button"
                  onClick={() => onClickDeleteLecture(lecture.id)}
                >
                  <CloseIcon />
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SemesterCourseTable;
