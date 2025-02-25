import useTimetableMutation from 'pages/TimetablePage/hooks/useTimetableMutation';
import { Lecture, MyLectureInfo } from 'api/timetable/entity';
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import SemesterList from 'pages/TimetablePage/components/SemesterList';
import useSemesterCheck from 'pages/TimetablePage/hooks/useMySemester';
import { useSemester } from 'utils/zustand/semester';
import useTokenState from 'utils/hooks/state/useTokenState';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { Portal } from 'components/common/Modal/PortalProvider';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import CloseIcon from 'assets/svg/modal-close-icon.svg';
import CourseTypeList from './CourseTypeList';
import SemesterCourseTable from './SemesterCourseTable';
import styles from './CourseTable.module.scss';
import DeleteLectureModal from './DeleteLectureModal';

function CourseTable({ frameId }: { frameId: number }) {
  const token = useTokenState();
  const portalManager = useModalPortal();
  const { removeMyLecture } = useTimetableMutation(frameId);
  const { myLectures }: { myLectures: (MyLectureInfo | Lecture) [] } = useMyLectures(frameId);
  const { editMyLecture } = useTimetableMutation(frameId);
  const semester = useSemester();
  const { data: mySemester } = useSemesterCheck(token);
  const navigate = useNavigate();

  const [isModalOpen, setModalOpenTrue, setModalOpenFalse] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: setModalOpenFalse });

  const filteredMyLectures = (myLectures as MyLectureInfo[])
    .filter((lecture: MyLectureInfo) => lecture.lecture_id !== null);

  const handleCourseTypeChange = (id: number, newCourseType: string) => {
    const targetLecture = filteredMyLectures.find((lecture) => lecture.id === id) as MyLectureInfo;

    if (!targetLecture) return;
    editMyLecture({
      ...targetLecture,
      class_places: targetLecture.lecture_infos.map((info) => ({
        class_place: info.place,
      })),
      course_type: newCourseType,
    });
  };

  const onClickAddLecture = () => {
    if (mySemester?.semesters.length === 0) {
      toast.error('학기가 존재하지 않습니다. 학기를 추가해주세요.');
    } else {
      navigate(`/${ROUTES.TimetableRegular({ id: String(frameId), isLink: true })}?year=${semester?.year}&term=${semester?.term}`);
    }
  };

  const handleDeleteLecture = (id: number) => {
    const lectureToRemove = myLectures.find(
      (lecture: MyLectureInfo | Lecture) => lecture.id === id,
    );

    if (!lectureToRemove) return;

    removeMyLecture.mutate({ clickedLecture: lectureToRemove, id });
  };

  const onClickDeleteLecture = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();
    setModalOpenTrue();
    portalManager.open((portalOption: Portal) => (
      <DeleteLectureModal
        onClose={portalOption.close}
        handleDeleteLecture={() => handleDeleteLecture(id)}
        setModalOpenFalse={setModalOpenFalse}
      />
    ));
  };

  const tableData = filteredMyLectures.map((lecture: MyLectureInfo) => [
    <span key={`name-${lecture.id}`}>{lecture.class_title}</span>,
    <span key={`professor-${lecture.id}`}>{lecture.professor}</span>,
    <span key={`grades-${lecture.id}`}>{lecture.grades}</span>,
    <CourseTypeList
      key={`courseType-${lecture.id}`}
      courseTypeDefault={lecture.course_type}
      id={lecture.id}
      onCourseTypeChange={handleCourseTypeChange}
    />,
    <button
      key={`delete-${lecture.id}`}
      type="button"
      onClick={(e) => onClickDeleteLecture(e, lecture.id)}
      aria-label="삭제 버튼"
    >
      <CloseIcon />
    </button>,
  ]);

  return (
    <div
      className={styles['course-table']}
      ref={isModalOpen ? null : containerRef}
    >
      <SemesterList />
      <div className={styles.content}>
        <SemesterCourseTable
          tableData={tableData}
        />
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
