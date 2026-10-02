import { useQueries } from '@tanstack/react-query';
import type { Semester } from 'api/timetable/entity';
import { isValidTimetableFrameId, timetableQueries } from 'api/timetable/queries';
import useUserType from 'utils/hooks/auth/useUserType';
import { getSemesterKey } from 'utils/timetable/semester';

/** 강의가 하나라도 들어 있는 시간표가 있는 학기의 키(getSemesterKey) 집합. */
export default function useSemestersWithLectures(semesters: Semester[]) {
  const userType = useUserType();
  const frameResults = useQueries({
    queries: semesters.map((semester) =>
      timetableQueries.frameList(true, semester, { fallbackOnError: true, hasUserSemester: true, userType }),
    ),
  });
  const frames = semesters.flatMap((semester, index) =>
    (frameResults[index].data ?? []).flatMap((frame) =>
      isValidTimetableFrameId(frame.id) ? [{ semester, frameId: frame.id }] : [],
    ),
  );
  const lectureResults = useQueries({
    queries: frames.map(({ frameId }) => timetableQueries.lectureInfo(true, frameId)),
  });

  const isLoading =
    frameResults.some((result) => result.isPending) || lectureResults.some((result) => result.isPending);
  const semestersWithLectures = new Set(
    frames.flatMap(({ semester }, index) =>
      (lectureResults[index].data?.timetable.length ?? 0) > 0 ? [getSemesterKey(semester)] : [],
    ),
  );

  return { semestersWithLectures, isLoading };
}
