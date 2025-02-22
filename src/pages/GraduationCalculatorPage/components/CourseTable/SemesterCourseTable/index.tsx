/* eslint-disable jsx-a11y/control-has-associated-label */
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import useTimetableMutation from 'pages/TimetablePage/hooks/useTimetableMutation';
import { Lecture, MyLectureInfo } from 'api/timetable/entity';
import CourseTypeList from 'pages/GraduationCalculatorPage/components/CourseTable/CourseTypeList';
import CloseIcon from 'assets/svg/modal-close-icon.svg';
import styles from './SemesterCourseTable.module.scss';

function SemesterCourseTable({ frameId }: { frameId: number }) {
  const { removeMyLecture } = useTimetableMutation(frameId);
  const { myLectures } = useMyLectures(frameId);
  const { editMyLecture } = useTimetableMutation(frameId);

  const filteredMyLectures = (myLectures as MyLectureInfo[])
    .filter((lecture: MyLectureInfo) => lecture.lecture_id !== null);

  const onClickDeleteLecture = (id: number) => {
    let lectureToRemove: Lecture | MyLectureInfo | null = null;
    let lectureId = id;
    myLectures.forEach((lecture: Lecture | MyLectureInfo) => {
      if (lecture.id === id) {
        lectureToRemove = lecture;
        lectureId = lecture.id;
      }
    });
    removeMyLecture.mutate({ clickedLecture: lectureToRemove, id: lectureId });
  };

  const handleCourseTypeChange = (id: number, newCourseType: string) => {
    const targetLecture = filteredMyLectures.find((lecture) => lecture.id === id);
    if (!targetLecture) return;

    editMyLecture({
      ...targetLecture,
      class_places: [
        { class_place: '' },
      ],
      course_type: newCourseType,
    });
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
            <td align="center">
              <span>{lecture.class_title}</span>
            </td>
            <td align="center">
              <span>{lecture.professor}</span>
            </td>
            <td align="center">{lecture.grades}</td>
            <td align="center">
              {/* 모달에서 호출할 경우, props(이수구분)로 값 넘겨주기 */}
              <CourseTypeList
                courseTypeDefault={lecture.course_type}
                id={lecture.id}
                onCourseTypeChange={handleCourseTypeChange}
              />
            </td>
            <td align="center">
              <button
                type="button"
                onClick={() => onClickDeleteLecture(lecture.id)}
              >
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
