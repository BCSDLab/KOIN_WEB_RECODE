import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { isValidTimetableFrameId } from 'api/timetable/queries';
import useMyLectures from 'components/TimetablePage/hooks/useMyLectures';
import useSemesterOptionList from 'components/TimetablePage/hooks/useSemesterOptionList';
import useTimetableFrameList from 'components/TimetablePage/hooks/useTimetableFrameList';
import { BACKGROUND_COLOR, BORDER_TOP_COLOR } from 'static/timetable';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useSemester, useSemesterAction } from 'utils/zustand/semester';
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

export function FilledTimetableGrid({ timetableFrameId }: { timetableFrameId: number }) {
  const { myLectures } = useMyLectures(timetableFrameId);

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

export function LoggedInTimetablePreview() {
  const { updateSemester } = useSemesterAction();
  const semesterOptionList = useSemesterOptionList();
  const semester = useSemester();
  const token = useTokenState();
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);
  const currentFrameId = timetableFrameList?.find((frame) => frame.is_main)?.id;
  const isClient = useMount();

  useEffect(() => {
    if (semesterOptionList.length > 0) updateSemester(semesterOptionList[0].value);
  }, [semesterOptionList, updateSemester]);

  if (!isClient || !isValidTimetableFrameId(currentFrameId)) {
    return <ProfileTimetableGrid />;
  }

  return <FilledTimetableGrid timetableFrameId={currentFrameId} />;
}
