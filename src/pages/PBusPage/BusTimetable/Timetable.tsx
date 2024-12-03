import { getCourseName } from 'pages/PBusPage/ts/busModules';
import useBusTimetable, { useCityBusTimetable } from 'pages/PBusPage/hooks/useBusTimetable';
import useIndexValueSelect from 'pages/PBusPage/hooks/useIndexValueSelect';
import {
  BUS_TYPES, cityBusDirections, CITY_COURSES,
  EXPRESS_COURSES, SHUTTLE_COURSES, TERMINAL_CITY_BUS,
} from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import { ChangeEvent, useState } from 'react';
import dayjs from 'dayjs';
import styles from './BusTimetable.module.scss';

function Template({ headers, arrivalList }: { headers: string[], arrivalList: string[][] }) {
  return (
    <table className={styles.timetable} aria-expanded="true">
      <thead className={styles.timetable__head}>
        <tr>
          <th className={styles.timetable__cell}>{headers[0]}</th>
          <th className={styles.timetable__cell}>{headers[1]}</th>
        </tr>
      </thead>

      <tbody className={styles.timetable__body}>
        {arrivalList.map(([arrival, time], idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <tr className={styles.timetable__row} key={`${arrival} - ${time} - ${idx}`}>
            <td className={styles.timetable__cell}>{arrival}</td>
            <td className={styles.timetable__cell}>{time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ShuttleTimetable() {
  const [selectedCourseId, handleCourseChange] = useIndexValueSelect();
  const [selectedRoute, handleRouteChange, resetRoute] = useIndexValueSelect();
  const timetable = useBusTimetable(SHUTTLE_COURSES[selectedCourseId]);
  const logger = useLogger();

  return (
    <div>
      <div className={styles['timetable__dropdown-wrapper']}>
        <select
          className={styles.timetable__dropdown}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            handleCourseChange(e);
            resetRoute();
            logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'bus_timetable_area', value: getCourseName(SHUTTLE_COURSES[Number(e.target.value)]) });
          }}
        >
          {SHUTTLE_COURSES.map((course, index) => (
            <option key={getCourseName(course)} value={index}>{getCourseName(course)}</option>
          ))}
        </select>

        <select
          className={styles.timetable__dropdown}
          value={selectedRoute}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedRouteIndex = Number(e.target.value);
            handleRouteChange(e);
            logger.actionEventClick({
              actionTitle: 'CAMPUS',
              title: 'bus_timetable_shuttle_route',
              value: timetable.info.bus_timetables[selectedRouteIndex].route_name,
            });
          }}
        >
          {timetable.info.bus_timetables.map((routeInfo, index) => (
            <option key={routeInfo.route_name} value={index}>{routeInfo.route_name}</option>
          ))}
        </select>
      </div>

      <Template
        headers={BUS_TYPES[0].tableHeaders}
        arrivalList={
          timetable.info.bus_timetables[selectedRoute]
            .arrival_info.map((arrival) => Object.values(arrival))
        }
      />
      <div className={styles.timetable__date}>
        업데이트 날짜:
        {' '}
        {dayjs(timetable.info.updated_at).format('YYYY-MM-DD')}
      </div>
    </div>
  );
}

function ExpressTimetable() {
  const [selectedCourseId, handleCourseChange] = useIndexValueSelect();
  const timetable = useBusTimetable(EXPRESS_COURSES[selectedCourseId]);
  const logger = useLogger();

  return (
    <div>
      <div className={styles['timetable__dropdown-wrapper']}>
        <select
          className={styles.timetable__dropdown}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            handleCourseChange(e);
            logger.actionEventClick({
              actionTitle: 'CAMPUS',
              title: 'bus_timetable_express',
              value: EXPRESS_COURSES[Number(e.target.value)].name,
            });
          }}
        >
          {EXPRESS_COURSES.map((course, index) => (
            <option key={course.name} value={index}>{course.name}</option>
          ))}
        </select>
      </div>

      <Template
        headers={BUS_TYPES[1].tableHeaders}
        arrivalList={timetable.info.bus_timetables.map((info) => [info.departure, info.arrival])}
      />
      <div className={styles.timetable__date}>
        업데이트 날짜:
        {' '}
        {dayjs(timetable.info.updated_at).format('YYYY-MM-DD')}
      </div>
    </div>
  );
}

function CityTimetable() {
  const [selectedDirection, setSelectedDirection] = useState(cityBusDirections[0].value);
  const [selectedBusNumber, setSelectedBusNumber] = useState(CITY_COURSES[0].bus_number);
  const logger = useLogger();

  const handleDirectionToggle = () => {
    setSelectedDirection((prevDirection) => (
      prevDirection === cityBusDirections[0].value
        ? cityBusDirections[1].value : cityBusDirections[0].value
    ));
  };

  const handleBusNumberChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedBusNumber(Number(e.target.value));
  };

  const timetable = useCityBusTimetable({
    bus_number: selectedBusNumber,
    direction: selectedDirection === 'to'
      ? CITY_COURSES.find((course) => course.bus_number === selectedBusNumber && course.direction !== TERMINAL_CITY_BUS)?.direction || ''
      : TERMINAL_CITY_BUS,
  });

  const getBusNumbersBySelectedDirection = () => CITY_COURSES.filter((course) => (selectedDirection === 'to'
    ? course.direction !== TERMINAL_CITY_BUS
    : course.direction === TERMINAL_CITY_BUS)).map((course) => course.bus_number);

  const getTodayTimetable = () => {
    const today = dayjs().day();
    const dayType = (today === 0 || today === 6) ? '주말' : '평일';

    const todayTimetable = timetable.info.bus_timetables.find(
      (info) => info.day_of_week === dayType,
    );

    const getHours = (time: string) => parseInt(time.split(':')[0], 10);

    const fullTimetable = Array.from({
      length: Math.max(
        todayTimetable?.depart_info.filter((time) => getHours(time) < 12).length || 0,
        todayTimetable?.depart_info.filter((time) => getHours(time) >= 12).length || 0,
      ),
    }, (_, idx) => [
      todayTimetable?.depart_info.filter((time) => getHours(time) < 12)[idx] || '',
      todayTimetable?.depart_info.filter((time) => getHours(time) >= 12)[idx] || '',
    ]);

    return fullTimetable;
  };

  return (
    <>
      <div className={styles['timetable__dropdown-wrapper']}>
        <button
          className={styles.timetable__button}
          onClick={() => {
            handleDirectionToggle();
            logger.actionEventClick({
              actionTitle: 'CAMPUS',
              title: 'bus_timetable_citybus',
              value: cityBusDirections.find(
                (direction) => direction.value !== selectedDirection,
              )?.label ?? '',
            });
          }}
          type="button"
        >
          {cityBusDirections.find((direction) => direction.value === selectedDirection)?.label}
        </button>
        <select
          className={styles.timetable__dropdown}
          value={selectedBusNumber}
          onChange={(e) => {
            handleBusNumberChange(e);
            logger.actionEventClick({
              actionTitle: 'CAMPUS',
              title: 'bus_timetable_citybus_route',
              value: `${e.target.value}번`,
            });
          }}
        >
          {getBusNumbersBySelectedDirection().map((busNumber) => (
            <option key={busNumber} value={busNumber}>
              {busNumber}
              번
            </option>
          ))}
        </select>
      </div>
      <Template
        headers={BUS_TYPES[2].tableHeaders}
        arrivalList={getTodayTimetable()}
      />
      <div className={styles.timetable__date}>
        기점 출발 시간표로 노선 별로 기점이 상이할 수 있습니다.
        <br />
        업데이트 날짜:
        {' '}
        {dayjs(timetable.info.updated_at).format('YYYY-MM-DD')}
      </div>
    </>
  );
}

export default {
  Shuttle: ShuttleTimetable,
  Express: ExpressTimetable,
  City: CityTimetable,
};
