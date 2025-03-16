import useTimetableMutation from 'pages/TimetablePage/hooks/useTimetableMutation';
import { Lecture, MyLectureInfo } from 'api/timetable/entity';
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import SemesterList from 'pages/TimetablePage/components/SemesterList';
import useSemesterCheck from 'pages/TimetablePage/hooks/useMySemester';
import { useSemester } from 'utils/zustand/semester';
import useTokenState from 'utils/hooks/state/useTokenState';
import useLogger from 'utils/hooks/analytics/useLogger';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { Portal } from 'components/modal/Modal/PortalProvider';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import CloseIcon from 'assets/svg/modal-close-icon.svg';
import useAllMyLectures from 'pages/TimetablePage/hooks/useAllMyLectures';
import BubbleTailBottom from 'assets/svg/bubble-tail-bottom.svg';
import CourseTypeList from './CourseTypeList';
import SemesterCourseTable from './SemesterCourseTable';
import styles from './CourseTable.module.scss';
import DeleteLectureModal from './DeleteLectureModal';

function CourseTable({ frameId }: { frameId: number }) {
  const logger = useLogger();
  const token = useTokenState();
  const portalManager = useModalPortal();
  const { removeMyLecture } = useTimetableMutation(frameId);
  const { myLectures }: { myLectures: (MyLectureInfo | Lecture) [] } = useMyLectures(frameId);
  const allMyLectures = useAllMyLectures(token);
  const isUnSelectedCourseType = (allMyLectures ?? []).find((item) => item.course_type === '이수구분선택');
  const { editMyLecture } = useTimetableMutation(frameId);
  const semester = useSemester();
  const { data: mySemester } = useSemesterCheck(token);
  const navigate = useNavigate();

  const [isModalOpen, setModalOpenTrue, setModalOpenFalse] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: setModalOpenFalse });

  const filteredMyLectures = (myLectures as MyLectureInfo[] ?? [])
    .filter((lecture: MyLectureInfo) => lecture.lecture_id !== null || Number(lecture.grades) > 0);

  const handleCourseTypeChange = (
    id: number,
    newCourseType: string,
    newGeneralEducationArea?: string,
  ) => {
    const targetLecture = filteredMyLectures.find((lecture) => lecture.id === id) as MyLectureInfo;

    if (!targetLecture) return;

    editMyLecture({
      ...targetLecture,
      class_places: targetLecture.lecture_infos.map((info) => ({
        class_place: info.place,
      })),
      course_type: newCourseType,
      general_education_area: newGeneralEducationArea ?? undefined,
    });
  };

  const onClickEditTimetable = () => {
    logger.actionEventClick({
      actionTitle: 'USER',
      event_label: 'graduation_calculator_edit_timetable',
      value: '시간표 수정',
      event_category: 'click',
    });
    if (mySemester?.semesters.length === 0) {
      toast.error('학기가 존재하지 않습니다. 학기를 추가해주세요.');
    } else {
      navigate(`/${ROUTES.TimetableRegular({ id: String(frameId), isLink: true })}?year=${semester?.year}&term=${semester?.term}`);
    }
  };

  const handleDeleteLecture = (id: number, disableRecoverButton: boolean) => {
    const lectureToRemove = myLectures.find(
      (lecture: MyLectureInfo | Lecture) => lecture.id === id,
    );

    if (!lectureToRemove) return;

    removeMyLecture.mutate({ clickedLecture: lectureToRemove, id, disableRecoverButton });
  };

  const onClickDeleteLecture = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();
    setModalOpenTrue();
    portalManager.open((portalOption: Portal) => (
      <DeleteLectureModal
        onClose={portalOption.close}
        handleDeleteLecture={() => handleDeleteLecture(id, true)}
        setModalOpenFalse={setModalOpenFalse}
      />
    ));
  };

  const tableData = filteredMyLectures.map((lecture: MyLectureInfo) => [
    <span>{lecture.class_title}</span>,
    <span>{lecture.professor}</span>,
    <span>{lecture.grades}</span>,
    <CourseTypeList
      courseTypeDefault={lecture.course_type}
      selectedGeneralEducationArea={lecture.general_education_area}
      id={lecture.id}
      onCourseTypeChange={handleCourseTypeChange}
    />,
    <button
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
        <div className={styles.content__table}>
          <SemesterCourseTable
            tableData={tableData}
          />
        </div>
        <button
          type="button"
          className={styles.content__trigger}
          onClick={onClickEditTimetable}
        >
          시간표 수정하기
        </button>
        {isUnSelectedCourseType && (
          <div className={styles.tooltip}>
            <div className={styles.tooltip__content}>
              이수구분선택 상태인 강의가
              <br />
              남아있으니 선택해주세요.
            </div>
            <div className={styles.tooltip__asset}>
              <BubbleTailBottom />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseTable;
