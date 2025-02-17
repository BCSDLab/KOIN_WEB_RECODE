import SemesterList from 'pages/TimetablePage/components/SemesterList';
import useSemesterCheck from 'pages/TimetablePage/hooks/useMySemester';
import { useSemester } from 'utils/zustand/semester';
import useTokenState from 'utils/hooks/state/useTokenState';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import SemesterCourseTable from './SemesterCourseTable';
import styles from './CourseTable.module.scss';

function CourseTable({ frameId }: { frameId: number }) {
  const token = useTokenState();
  const semester = useSemester();
  const { data: mySemester } = useSemesterCheck(token);
  const navigate = useNavigate();

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
      <div className={styles.content}>
        <SemesterCourseTable frameId={frameId} />
        <button
          type="button"
          className={styles.trigger}
          onClick={onClickAddLecture}
        >
          시간표 수정하기
        </button>
      </div>
    </div>
  );
}

export default CourseTable;
