import { getCourseName } from 'pages/BusPage/ts/busModules';
import useBusTimetable from 'pages/BusPage/hooks/useBusTimetable';
import useIndexValueSelect from 'pages/BusPage/hooks/useIndexValueSelect';
import {
  BUS_TYPES, CITY_BUS_TIMETABLE, EXPRESS_COURSES, SHUTTLE_COURSES,
} from 'static/bus';
import useLogger from 'utils/hooks/useLogger';
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
        {arrivalList.map(([arrival, time]) => (
          <tr className={styles.timetable__row} key={`${arrival} - ${time}`}>
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
  return (
    <>
      <div className={styles['timetable__citybus-blank']} />
      <Template headers={BUS_TYPES[2].tableHeaders} arrivalList={CITY_BUS_TIMETABLE} />
      <div className={styles['timetable__citybus-info']}>
        버스번호: 400, 402, 405
      </div>
    </>
  );
}

export default {
  Shuttle: ShuttleTimetable,
  Express: ExpressTimetable,
  City: CityTimetable,
};
