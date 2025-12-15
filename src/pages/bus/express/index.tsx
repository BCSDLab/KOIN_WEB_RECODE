import { useState } from 'react';
import { cn } from '@bcsdlab/utils';
import BusCoursePage from 'components/Bus/BusCoursePage';
import Template from 'components/Bus/BusCoursePage/components/ExternalTemplate';
import InfoFooter from 'components/Bus/BusCoursePage/components/InfoFooter';
import useBusPrefetch from 'components/Bus/BusCoursePage/hooks/useBusPrefetch';
import { useExpressTimetable } from 'components/Bus/BusCoursePage/hooks/useBusTimetable';
import dayjs from 'dayjs';
import { EXPRESS_COURSES } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './ExpressBusTimetable.module.scss';

export default function ExpressBusTimetable() {
  const [selectedCourseId, setSelectedCourseId] = useState(0);
  const [destinationCategory, setDestinationCategory] = useState('병천방면');

  const timetable = useExpressTimetable(EXPRESS_COURSES[selectedCourseId]);
  const prefetchBusTimetable = useBusPrefetch();
  const logger = useLogger();

  return (
    <BusCoursePage>
      <div className={styles['timetable-container']}>
        <div className={styles['course-category']}>
          <div className={styles['course-category__button']}>운행</div>
          {EXPRESS_COURSES.map((course, index) => (
            <button
              key={course.name}
              className={cn({
                [styles['course-category__button']]: true,
                [styles['course-category__button--selected']]: course.name === destinationCategory,
              })}
              type="button"
              onClick={() => {
                setSelectedCourseId(index);
                setDestinationCategory(course.name);
                logger.actionEventClick({
                  team: 'CAMPUS',
                  event_label: 'ds_bus_direction',
                  value: course.name,
                });
              }}
              onMouseEnter={() =>
                prefetchBusTimetable({
                  type: 'express',
                  bus_type: course.bus_type,
                  direction: course.direction,
                  region: course.region,
                })
              }
            >
              {course.name}
            </button>
          ))}
        </div>

        <Template
          typeNumber={1}
          arrivalList={(() => {
            const getHours = (time: string) => parseInt(time.split(':')[0], 10);

            const morning = timetable.info.bus_timetables
              .map((info) => info.departure)
              .filter((time) => getHours(time) < 12); // 오전

            const afternoon = timetable.info.bus_timetables
              .map((info) => info.departure)
              .filter((time) => getHours(time) >= 12); // 오후

            // 오전, 오후 길이 다를 시 맞추기
            const maxLength = Math.max(morning.length, afternoon.length);
            return Array.from({ length: maxLength }, (_, idx) => [morning[idx] || '', afternoon[idx] || '']);
          })()}
        />

        <InfoFooter
          type="EXPRESS"
          updated={dayjs(timetable.info.updated_at).format('YYYY-MM-DD')}
          destinationCategory={destinationCategory}
        />
      </div>
    </BusCoursePage>
  );
}
