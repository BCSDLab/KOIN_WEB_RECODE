import { getCourseName } from 'pages/BusPage/ts/busModules';
import useBusTimetable, { useCityBusTimetable } from 'pages/BusPage/hooks/useBusTimetable';
import useIndexValueSelect from 'pages/BusPage/hooks/useIndexValueSelect';
import {
  BUS_TYPES, cityBusDirections, CITY_COURSES, EXPRESS_COURSES, SHUTTLE_COURSES,
} from 'static/bus';
import useLogger from 'utils/hooks/useLogger';
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
          onChange={(e) => {
            handleCourseChange(e);
            resetRoute();
          }}
          onClick={() => logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'bus_timetable_area', value: getCourseName(SHUTTLE_COURSES[selectedCourseId]) })}
        >
          {SHUTTLE_COURSES.map((course, index) => (
            <option key={getCourseName(course)} value={index}>{getCourseName(course)}</option>
          ))}
        </select>

        <select
          className={styles.timetable__dropdown}
          value={selectedRoute}
          onChange={handleRouteChange}
          onClick={() => logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'bus_timetable_time', value: timetable.info.bus_timetables[selectedRoute].route_name })}
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
        마지막 업데이트:
        {' '}
        {timetable.info.updated_at}
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
          onChange={handleCourseChange}
          onClick={() => logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'bus_timetable_express', value: EXPRESS_COURSES[selectedCourseId].name })}
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
        마지막 업데이트:
        {' '}
        {timetable.info.updated_at}
      </div>
    </div>
  );
}

function CityTimetable() {
  const [selectedDirection, setSelectedDirection] = useState(cityBusDirections[0].value);
  const [selectedBusNumber, setSelectedBusNumber] = useState(CITY_COURSES[0].bus_number);

  const handleDirectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newDirection = e.target.value;
    setSelectedDirection(newDirection);
    const defaultBusNumber = CITY_COURSES.find((course) => course.direction === (newDirection === 'to' ? '병천3리' : '종합터미널'))?.bus_number || 400;
    setSelectedBusNumber(defaultBusNumber);
  };

  const handleBusNumberChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedBusNumber(Number(e.target.value));
  };

  const timetable = useCityBusTimetable({
    bus_number: selectedBusNumber,
    direction: selectedDirection === 'to' ? CITY_COURSES.find((course) => course.bus_number === selectedBusNumber && course.direction !== '종합터미널')?.direction || '' : '종합터미널',
  });

  const getBusNumbersBySelectedDirection = () => CITY_COURSES.filter((course) => (selectedDirection === 'to'
    ? course.direction !== '종합터미널'
    : course.direction === '종합터미널')).map((course) => course.bus_number);

  const getTodayTimetable = () => {
    const today = dayjs().day();
    let dayType = '';

    if (today === 0 || today === 6) {
      dayType = '주말';
    } else {
      dayType = '평일';
    }

    const todayTimetable = timetable.info.bus_timetables.find(
      (info) => info.day_of_week === dayType,
    );

    const getHours = (time:string) => parseInt(time.split(':')[0], 10);

    const morningTimetable = todayTimetable?.depart_info.filter(
      (time) => getHours(time) < 12,
    ) || [];
    const afternoonTimetable = todayTimetable?.depart_info.filter(
      (time) => getHours(time) >= 12,
    ) || [];

    const fullTimetable = Array.from({
      length: Math.max(morningTimetable.length, afternoonTimetable.length),
    }, (_, idx) => [
      morningTimetable[idx] || '',
      afternoonTimetable[idx] || '',
    ]);

    return fullTimetable;
  };

  return (
    <>
      <div className={styles['timetable__dropdown-wrapper']}>
        <select
          className={styles.timetable__dropdown}
          value={selectedDirection}
          onChange={handleDirectionChange}
        >
          {cityBusDirections.map((direction) => (
            <option key={direction.value} value={direction.value}>
              {direction.label}
            </option>
          ))}
        </select>
        <select
          className={styles.timetable__dropdown}
          value={selectedBusNumber}
          onChange={handleBusNumberChange}
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
        마지막 업데이트:
        {' '}
        {timetable.info.updated_at}
        <br />
        한기대 → 터미널 시간표는 기점 출발시간입니다.
      </div>
    </>
  );
}

export default {
  Shuttle: ShuttleTimetable,
  Express: ExpressTimetable,
  City: CityTimetable,
};
