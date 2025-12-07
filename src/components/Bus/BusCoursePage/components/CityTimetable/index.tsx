import { useState } from 'react';
import { cn } from '@bcsdlab/utils';
import Template from 'components/Bus/BusCoursePage/components/ExternalTemplate';
import InfoFooter from 'components/Bus/BusCoursePage/components/InfoFooter';
import { useCityBusTimetable } from 'components/Bus/BusCoursePage/hooks/useBusTimetable';
import dayjs from 'dayjs';
import { cityBusDirections, CITY_COURSES, TERMINAL_CITY_BUS } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './CityTimetable.module.scss';

type Direction = {
  label: string;
  value: string;
};

export default function CityTimetable() {
  const [selectedDirection, setSelectedDirection] = useState(cityBusDirections[0].value);
  const [selectedBusNumber, setSelectedBusNumber] = useState(CITY_COURSES[0].bus_number);
  const logger = useLogger();

  const timetable = useCityBusTimetable({
    bus_number: selectedBusNumber,
    direction:
      selectedDirection === 'to'
        ? CITY_COURSES.find(
            (course) => course.bus_number === selectedBusNumber && course.direction !== TERMINAL_CITY_BUS,
          )?.direction || ''
        : TERMINAL_CITY_BUS,
  });

  const handleBusNumberButton = (busNum: number) => {
    setSelectedBusNumber(busNum);
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'city_bus_route',
      value: `${busNum}번`,
    });
  };

  const handleDirectionButton = (direction: Direction) => {
    setSelectedDirection(direction.value);
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'city_bus_direction',
      value: direction.label,
    });
  };

  const getTodayTimetable = () => {
    const today = dayjs().day();
    const dayType = today === 0 || today === 6 ? '주말' : '평일';

    const todayTimetable = timetable.info.bus_timetables.find((info) => info.day_of_week === dayType);

    const getHours = (time: string) => parseInt(time.split(':')[0], 10);

    const fullTimetable = Array.from(
      {
        length: Math.max(
          todayTimetable?.depart_info.filter((time) => getHours(time) < 12).length || 0,
          todayTimetable?.depart_info.filter((time) => getHours(time) >= 12).length || 0,
        ),
      },
      (_, idx) => [
        todayTimetable?.depart_info.filter((time) => getHours(time) < 12)[idx] || '',
        todayTimetable?.depart_info.filter((time) => getHours(time) >= 12)[idx] || '',
      ],
    );

    return fullTimetable;
  };

  return (
    <div className={styles['timetable-container']}>
      <div className={styles['city-container']}>
        <div className={styles['city-label']}>
          <div className={styles['city-label__button']}>노선</div>
          {CITY_COURSES.slice(0, 3).map((cityCourse) => (
            <button
              className={cn({
                [styles['city-label__button']]: true,
                [styles['city-label__button--selected']]: cityCourse.bus_number === selectedBusNumber,
              })}
              type="button"
              onClick={() => handleBusNumberButton(cityCourse.bus_number)}
            >
              {cityCourse.bus_number}번
            </button>
          ))}
        </div>

        <div className={styles['city-label']}>
          <div className={styles['city-label__button']}>운행</div>
          {cityBusDirections.map((cityBusDirection) => (
            <button
              className={cn({
                [styles['city-label__button']]: true,
                [styles['city-label__button--selected']]: cityBusDirection.value === selectedDirection,
              })}
              type="button"
              onClick={() => handleDirectionButton(cityBusDirection)}
            >
              {cityBusDirection.label}
            </button>
          ))}
        </div>
      </div>

      <Template typeNumber={2} arrivalList={getTodayTimetable()} />

      <InfoFooter
        type="CITY"
        updated={dayjs(timetable.info.updated_at).format('YYYY-MM-DD')}
        selectedDirection={selectedDirection}
        selectedBusNumber={selectedBusNumber}
      />
    </div>
  );
}
