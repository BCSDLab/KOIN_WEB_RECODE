/* eslint-disable jsx-a11y/control-has-associated-label */
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import useTimetableMutation from 'pages/TimetablePage/hooks/useTimetableMutation';
import { Lecture, MyLectureInfo } from 'api/timetable/entity';
import SemesterList from 'pages/TimetablePage/components/SemesterList';
import useSemesterCheck from 'pages/TimetablePage/hooks/useMySemester';
import { useSemester } from 'utils/zustand/semester';
import useTokenState from 'utils/hooks/state/useTokenState';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import CloseIcon from 'assets/svg/modal-close-icon.svg';
import styles from './CourseTable.module.scss';

function CourseTable({ frameId }: { frameId: number }) {
  const { removeMyLecture } = useTimetableMutation(frameId);
  const { myLectures } = useMyLectures(frameId);
  const token = useTokenState();
  const semester = useSemester();
  const { data: mySemester } = useSemesterCheck(token);
  const navigate = useNavigate();

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

  const onClickAddLecture = () => {
    if (mySemester?.semesters.length === 0) {
      toast.error('학기가 존재하지 않습니다. 학기를 추가해주세요.');
    } else {
      navigate(`/${ROUTES.TimetableRegular({ id: String(frameId), isLink: true })}?year=${semester?.year}&term=${semester?.term}`);
    }
  };

  return (
    <div className={styles['course-table']}>
      <div className={styles.semester}>
        <SemesterList />
      </div>
      <div className={styles.table}>
        <table className={styles.table__content}>
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
              <tr key={lecture.id} className={styles['table__body-row']}>
                <td className="class_title" align="center">{lecture.class_title}</td>
                <td align="center">{lecture.professor}</td>
                <td align="center">{lecture.grades}</td>
                <td className="course_type" align="center">{}</td>
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
        <button
          type="button"
          className={styles.table__trigger}
          onClick={onClickAddLecture}
        >
          강의 추가하기
        </button>
      </div>
    </div>
  );
}

export default CourseTable;
