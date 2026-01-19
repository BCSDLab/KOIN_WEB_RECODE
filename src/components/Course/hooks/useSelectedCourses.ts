import { useMemo, useState } from 'react';
import { PreCourse } from 'api/course/entity';

export const getCourseKey = (course: PreCourse) => {
  const code = course.lecture_info?.lecture_code ?? 'custom';
  const section = course.class_number ?? 'none';
  const timeKey = course.class_time_raw.join(',');
  return `${code}-${section}-${course.grades}-${timeKey}`;
};

export default function useSelectedCourses() {
  const [selectedCourses, setSelectedCourses] = useState<PreCourse[]>([]);

  const selectedCredits = useMemo(() => {
    return selectedCourses.reduce((total, course) => {
      const credit = Number(course.grades.split('-')[0]);
      return Number.isNaN(credit) ? total : total + credit;
    }, 0);
  }, [selectedCourses]);

  const hasTimeConflict = (candidate: PreCourse) =>
    selectedCourses.some((course) => course.class_time_raw.some((time) => candidate.class_time_raw.includes(time)));

  const handleAddCourse = (course: PreCourse) => {
    if (hasTimeConflict(course)) {
      window.alert('이미 해당 시간에 겹치는 강의가 있습니다.');
      return;
    }

    if (selectedCourses.some((item) => getCourseKey(item) === getCourseKey(course))) {
      window.alert('이미 신청한 과목입니다.');
      return;
    }

    setSelectedCourses((prev) => [...prev, course]);
  };

  const handleRemoveCourse = (index: number) => {
    setSelectedCourses((prev) => prev.filter((_, idx) => idx !== index));
  };

  return {
    selectedCourses,
    selectedCredits,
    handleAddCourse,
    handleRemoveCourse,
  };
}
