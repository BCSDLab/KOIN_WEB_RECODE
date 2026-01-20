import React, { Suspense } from 'react';
import { Course, PreCourse } from 'api/course/entity';
import CourseSearchForm from 'components/Course/components/CourseSearchForm';
import CourseTable, {
  CreditDisplay,
  createOpenCoursesColumns,
  createPreCoursesColumns,
  createSelectedCoursesColumns,
} from 'components/Course/components/CourseTable';
import { useSuspenseCourseSearch, useSuspensePreCourseList } from 'components/Course/hooks/useCourseQuery';
import useCourseSearchForm from 'components/Course/hooks/useCourseSearchForm';
import useSelectedCourses, { getCourseKey } from 'components/Course/hooks/useSelectedCourses';
import useTimetableFrameList from 'components/TimetablePage/hooks/useTimetableFrameList';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useSemester } from 'utils/zustand/semester';
import styles from './CoursePage.module.scss';

interface OpenCoursesTableContentProps {
  searchParams: { name?: string; department?: string; year?: number; semester?: string };
  onAddCourse: (course: PreCourse) => void;
}

function OpenCoursesTableContent({ searchParams, onAddCourse }: OpenCoursesTableContentProps) {
  const { data: courses } = useSuspenseCourseSearch(searchParams);
  const columns = createOpenCoursesColumns(onAddCourse);

  return (
    <CourseTable<Course>
      variant="open"
      title="개설강좌 정보"
      data={courses}
      columns={columns}
      getRowKey={(course) => `${course.lecture_info.lecture_code}-${course.class_number}`}
    />
  );
}

interface PreCoursesTableContentProps {
  token: string;
  timetableFrameId: number;
  onAddCourse: (course: PreCourse) => void;
}

function PreCoursesTableContent({ token, timetableFrameId, onAddCourse }: PreCoursesTableContentProps) {
  const { data: preCourses } = useSuspensePreCourseList(token, timetableFrameId);
  const columns = createPreCoursesColumns(onAddCourse);

  return (
    <CourseTable<PreCourse>
      variant="pre"
      title="예비수강과목"
      data={preCourses}
      columns={columns}
      getRowKey={(course, index) =>
        course.lecture_info ? `${course.lecture_info.lecture_code}-${course.class_number}` : `custom-${index}`
      }
    />
  );
}

function CoursePage() {
  const token = useTokenState();
  const semester = useSemester();

  const { formInputs, searchParams, handleSearch, handleDepartmentChange, handleNameChange } = useCourseSearchForm({
    initialYear: semester.year,
    initialSemester: semester.term,
  });

  const { data: timetableFrameList } = useTimetableFrameList(token, semester);
  const mainFrame = timetableFrameList?.find((frame) => frame.is_main);
  const timetableFrameId = mainFrame?.id ?? 0;
  const hasValidFrameId = !!mainFrame?.id;

  const { selectedCourses, selectedCredits, handleAddCourse, handleRemoveCourse } = useSelectedCourses();

  const selectedCoursesColumns = createSelectedCoursesColumns(handleRemoveCourse);

  return (
    <div className={styles.viewport}>
      <div className={styles.page}>
        <CourseSearchForm
          formInputs={formInputs}
          semester={semester}
          onSearch={handleSearch}
          onDepartmentChange={handleDepartmentChange}
          onNameChange={handleNameChange}
        />

        <div className={styles.content}>
          <div className={styles.content__left}>
            <Suspense fallback={<div>개설강좌 로딩중...</div>}>
              <OpenCoursesTableContent searchParams={searchParams} onAddCourse={handleAddCourse} />
            </Suspense>
          </div>

          <div className={styles.content__right}>
            {token && hasValidFrameId ? (
              <Suspense fallback={<div>예비수강과목 로딩중...</div>}>
                <PreCoursesTableContent
                  token={token}
                  timetableFrameId={timetableFrameId}
                  onAddCourse={handleAddCourse}
                />
              </Suspense>
            ) : (
              <div className={styles.placeholder}>로그인 후 예비수강과목을 확인할 수 있습니다.</div>
            )}

            <CourseTable<PreCourse>
              variant="selected"
              title="수강신청과목"
              data={selectedCourses}
              columns={selectedCoursesColumns}
              getRowKey={getCourseKey}
              headerExtra={<CreditDisplay credits={selectedCredits} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

CoursePageWrapper.getLayout = (page: React.ReactNode) => page;

export default function CoursePageWrapper() {
  return (
    <Suspense fallback={<div className={styles.page}>로딩 중...</div>}>
      <CoursePage />
    </Suspense>
  );
}
