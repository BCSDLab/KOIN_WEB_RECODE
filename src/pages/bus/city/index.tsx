import { useMemo, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import { DirectionType } from 'api/bus/entity';
import BusCoursePage from 'components/Bus/BusCoursePage';
import Template from 'components/Bus/BusCoursePage/components/ExternalTemplate';
import InfoFooter from 'components/Bus/BusCoursePage/components/InfoFooter';
import useBusPrefetch from 'components/Bus/BusCoursePage/hooks/useBusPrefetch';
import { useCityBusTimetable } from 'components/Bus/BusCoursePage/hooks/useBusTimetable';
import dayjs from 'dayjs';
import { CITY_COURSES, CITY_COURSES_MAP } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './CityBusTimetable.module.scss';

type CityDirectionOption = {
  label: string;
  value: DirectionType;
};

const cityBusDirections: CityDirectionOption[] = [
  { label: '천안방면', value: 'from' },
  { label: '병천방면', value: 'to' },
];

const getHours = (time: string) => parseInt(time.split(':')[0], 10);

export default function CityBusTimetable() {
  const [selectedBusNumber, setSelectedBusNumber] = useState(CITY_COURSES[3].bus_number); // 400
  const [selectedDirectionType, setSelectedDirectionType] = useState<DirectionType>(CITY_COURSES[3].direction_type); // to (병천 방면)

  const prefetchBusTimetable = useBusPrefetch();
  const logger = useLogger();

  const selectedDirection = CITY_COURSES_MAP.get(`${selectedBusNumber}-${selectedDirectionType}`)?.direction ?? '';

  const timetable = useCityBusTimetable({
    bus_number: selectedBusNumber,
    direction: selectedDirection,
  });

  const handleBusNumberButton = (busNum: number) => {
    setSelectedBusNumber(busNum);
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'city_bus_route',
      value: `${busNum}번`,
    });
  };

  const handleDirectionButton = (direction: CityDirectionOption) => {
    setSelectedDirectionType(direction.value);

    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'city_bus_direction',
      value: direction.label,
    });
  };

  function getDirection(bus_number: number, direction_type: DirectionType) {
    return CITY_COURSES_MAP.get(`${bus_number}-${direction_type}`)?.direction ?? '';
  }

  const processedTimetable = useMemo(() => {
    if (!timetable?.info?.bus_timetables) return [];

    const today = dayjs().day();
    const dayType = today === 0 || today === 6 ? '주말' : '평일';
    const todayTimetable = timetable.info.bus_timetables.find((info) => info.day_of_week === dayType);

    if (!todayTimetable) return [];

    const departInfo = todayTimetable.depart_info;
    const amTimes = departInfo.filter((time) => getHours(time) < 12);
    const pmTimes = departInfo.filter((time) => getHours(time) >= 12);

    const maxLength = Math.max(amTimes.length, pmTimes.length);

    return Array.from({ length: maxLength }, (_, idx) => [amTimes[idx] || '', pmTimes[idx] || '']);
  }, [timetable]);

  return (
    <BusCoursePage>
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
                onMouseEnter={() =>
                  prefetchBusTimetable({
                    type: 'city',
                    bus_number: cityCourse.bus_number,
                    direction: getDirection(cityCourse.bus_number, selectedDirectionType),
                  })
                }
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
                  [styles['city-label__button--selected']]: cityBusDirection.value === selectedDirectionType,
                })}
                type="button"
                onClick={() => handleDirectionButton(cityBusDirection)}
                onMouseEnter={() =>
                  prefetchBusTimetable({
                    type: 'city',
                    bus_number: selectedBusNumber,
                    direction: getDirection(selectedBusNumber, cityBusDirection.value),
                  })
                }
              >
                {cityBusDirection.label}
              </button>
            ))}
          </div>
        </div>

        <Template typeNumber={2} arrivalList={processedTimetable} />

        <InfoFooter
          type="CITY"
          updated={dayjs(timetable.info.updated_at).format('YYYY-MM-DD')}
          selectedDirection={selectedDirection}
          selectedBusNumber={selectedBusNumber}
        />
      </div>
    </BusCoursePage>
  );
}
