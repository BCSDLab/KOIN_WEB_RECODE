import { useMemo, useState } from 'react';
import { PreCourse } from 'api/course/entity';

const SELECTED_COURSES_KEY = 'selected-courses';

const getStoredCourses = (): PreCourse[] => {
  try {
    const stored = sessionStorage.getItem(SELECTED_COURSES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const storeCourses = (courses: PreCourse[]) => {
  try {
    sessionStorage.setItem(SELECTED_COURSES_KEY, JSON.stringify(courses));
  } catch {
    // sessionStorage 용량 초과 등 무시
  }
};

export const getCourseKey = (course: PreCourse) => {
  const code = course.lecture_info?.lecture_code ?? 'custom';
  const section = course.class_number ?? 'none';
  const timeKey = course.class_time_raw.join(',');
  return `${code}-${section}-${course.grades}-${timeKey}`;
};

export default function useSelectedCourses() {
  const [selectedCourses, setSelectedCourses] = useState<PreCourse[]>(getStoredCourses);

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

    setSelectedCourses((prev) => {
      const next = [...prev, course];
      storeCourses(next);
      return next;
    });
  };

  const handleRemoveCourse = (index: number) => {
    setSelectedCourses((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      storeCourses(next);
      return next;
    });
  };

  return {
    selectedCourses,
    selectedCredits,
    handleAddCourse,
    handleRemoveCourse,
  };
}
