import type { ReactNode } from 'react';

import type { Semester } from 'api/timetable/entity';
import { isValidTimetableFrameId } from 'api/timetable/queries';
import useMyLectures from 'components/TimetablePage/hooks/useMyLectures';
import useResetInvalidSemester from 'components/TimetablePage/hooks/useResetInvalidSemester';
import useTimetableFrameList from 'components/TimetablePage/hooks/useTimetableFrameList';
import { BACKGROUND_COLOR, BORDER_TOP_COLOR } from 'static/timetable';
import useMount from 'utils/hooks/state/useMount';
import { useSemester } from 'utils/zustand/semester';

import styles from './TimetablePreview.module.scss';

const timetableDays = ['월', '화', '수', '목', '금'];
const timetableHours = ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];

export function ProfileTimetableGrid({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.timetable__gridBoard}>
      <div className={styles.timetable__corner} />
      {timetableDays.map((day) => (
        <div key={day} className={styles.timetable__day}>
          {day}
        </div>
      ))}
      <div className={styles.timetable__hours}>
        {timetableHours.map((hour) => (
          <span key={hour}>{hour}</span>
        ))}
      </div>
      <div className={styles.timetable__grid}>{children}</div>
    </div>
  );
}

export function FilledTimetableGrid({ timetableFrameId, semester }: { timetableFrameId: number; semester: Semester }) {
  const { myLectures } = useMyLectures(timetableFrameId, semester);

  return (
    <ProfileTimetableGrid>
      {myLectures?.map((lecture, lectureIndex) =>
        lecture.lecture_infos.map((info) => {
          const colorIndex = lectureIndex % BACKGROUND_COLOR.length;
          const title = 'name' in lecture ? lecture.name : lecture.class_title;

          return (
            <div
              key={`${lecture.id}-${info.day}-${info.start_time}`}
              className={styles.timetable__block}
              style={{
                gridColumn: info.day + 1,
                gridRow: `${(info.start_time % 100) + 1} / span ${(info.end_time % 100) - (info.start_time % 100) + 1}`,
                background: BACKGROUND_COLOR[colorIndex],
                borderTop: `2px solid ${BORDER_TOP_COLOR[colorIndex]}`,
              }}
            >
              <span>{title}</span>
              <small>{info.place}</small>
            </div>
          );
        }),
      )}
    </ProfileTimetableGrid>
  );
}

interface LoggedInTimetablePreviewProps {
  serverSemester: Semester;
  hasSemesterCookie: boolean;
}

/**
 * 학기는 서버가 학기 쿠키로 확정해 내린 값을 쓴다. 저장 학기가 무효하면 서버가 이미 되돌린 값이 오고,
 * useResetInvalidSemester가 스토어(와 쿠키)도 같은 값으로 맞춘다.
 */
export function LoggedInTimetablePreview({ serverSemester, hasSemesterCookie }: LoggedInTimetablePreviewProps) {
  useResetInvalidSemester();
  const storedSemester = useSemester();
  const isMounted = useMount();
  // 최후 수단 게이트: 쿠키 도입 전부터 localStorage에만 학기가 있던 브라우저는 서버가 고른 학기를 모른다.
  // 마운트 후 저장 학기로 바꾼다. 스토어 rehydrate 때 쿠키가 기록되므로 브라우저당 한 번뿐이다.
  const semester = !hasSemesterCookie && isMounted ? storedSemester : serverSemester;
  const { data: timetableFrameList } = useTimetableFrameList(semester);
  const currentFrameId = timetableFrameList?.find((frame) => frame.is_main)?.id;

  if (!isValidTimetableFrameId(currentFrameId)) {
    return <ProfileTimetableGrid />;
  }

  return <FilledTimetableGrid timetableFrameId={currentFrameId} semester={semester} />;
}
