import { getCourseName } from 'pages/BusPage/ts/busModules';
import useBusTimetable from 'pages/BusPage/hooks/useBusTimetable';
import useIndexValueSelect from 'pages/BusPage/hooks/useIndexValueSelect';
import {
  BUS_TYPES, CITY_BUS_TIMETABLE, EXPRESS_COURSES, SHUTTLE_COURSES,
} from 'static/bus';
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
  const { data: timetable } = useBusTimetable(SHUTTLE_COURSES[selectedCourseId]);

  return (
    <div>
      {timetable?.type === 'shuttle' && (
        <>
          <div className={styles['timetable__dropdown-wrapper']}>
            <select
              className={styles.timetable__dropdown}
              onChange={(e) => {
                handleCourseChange(e);
                resetRoute();
              }}
            >
              {SHUTTLE_COURSES.map((course, index) => (
                <option key={getCourseName(course)} value={index}>{getCourseName(course)}</option>
              ))}
            </select>

            <select
              className={styles.timetable__dropdown}
              onChange={handleRouteChange}
            >
              {timetable.info.map((routeInfo, index) => (
                <option key={routeInfo.route_name} value={index}>{routeInfo.route_name}</option>
              ))}
            </select>
          </div>

          <Template
            headers={BUS_TYPES[0].tableHeaders}
            arrivalList={
              timetable.info[selectedRoute].arrival_info.map((arrival) => Object.values(arrival))
            }
          />
        </>
      )}
    </div>
  );
}

function ExpressTimetable() {
  const [selectedCourseId, handleCourseChange] = useIndexValueSelect();
  const { data: timetable } = useBusTimetable(EXPRESS_COURSES[selectedCourseId]);

  return (
    <div>
      {timetable?.type === 'express' && (
        <>
          <div className={styles['timetable__dropdown-wrapper']}>
            <select
              className={styles.timetable__dropdown}
              onChange={handleCourseChange}
            >
              {EXPRESS_COURSES.map((course, index) => (
                <option key={course.name} value={index}>{course.name}</option>
              ))}
            </select>
          </div>

          <Template
            headers={BUS_TYPES[1].tableHeaders}
            arrivalList={timetable.info.map((info) => [info.departure, info.arrival])}
          />
        </>
      )}
    </div>
  );
}

function CityTimetable() {
  return (
    <>
      <div className={styles['timetable__citybus-info']}>
        버스번호: 400, 401
      </div>

      <Template headers={BUS_TYPES[2].tableHeaders} arrivalList={CITY_BUS_TIMETABLE} />
    </>
  );
}

export default {
  Shuttle: ShuttleTimetable,
  Express: ExpressTimetable,
  City: CityTimetable,
};
