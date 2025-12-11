import { useState } from 'react';
import { cn } from '@bcsdlab/utils';
import BusCoursePage from 'components/Bus/BusCoursePage';
import Template from 'components/Bus/BusCoursePage/components/ExternalTemplate';
import InfoFooter from 'components/Bus/BusCoursePage/components/InfoFooter';
import useBusTimetable from 'components/Bus/BusCoursePage/hooks/useBusTimetable';
import useIndexValueSelect from 'components/Bus/BusCoursePage/hooks/useIndexValueSelect';
import dayjs from 'dayjs';
import { EXPRESS_COURSES } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './ExpressBusTimetable.module.scss';

export default function ExpressBusTimetable() {
  const [selectedCourseId, handleCourseChange] = useIndexValueSelect();
  const timetable = useBusTimetable(EXPRESS_COURSES[selectedCourseId]);
  const [destinationCategory, setDestinationCategory] = useState('병천방면');
  const logger = useLogger();

  return (
    <BusCoursePage>
      <div className={styles['timetable-container']}>
        <div className={styles['course-category']}>
          <div className={styles['course-category__button']}>운행</div>
          {EXPRESS_COURSES.map((value, index) => (
            <button
              key={value.name}
              className={cn({
                [styles['course-category__button']]: true,
                [styles['course-category__button--selected']]: value.name === destinationCategory,
              })}
              type="button"
              onClick={(e) => {
                setDestinationCategory(value.name);
                handleCourseChange(e);
                logger.actionEventClick({
                  team: 'CAMPUS',
                  event_label: 'ds_bus_direction',
                  value: EXPRESS_COURSES[Number(e.currentTarget.dataset.value)].name,
                });
              }}
              data-value={index}
            >
              {value.name}
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
