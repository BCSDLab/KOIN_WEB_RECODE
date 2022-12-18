import { Suspense, useState } from 'react';
import cn from 'utils/ts/classnames';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import {
  BUS_TYPES, CITY_BUS_TIMETABLE, EXPRESS_COURSES, SHUTTLE_COURSES,
} from 'static/bus';
import { getCourseName } from 'pages/BusPage/ts/busModules';
import useBusTimetable from 'pages/BusPage/hooks/useBusTimetable';
import useIndexValueSelect from 'pages/BusPage/hooks/useIndexValueSelect';
import styles from './BusTimetable.module.scss';

function Timetable({ headers, arrivalList }: { headers: string[], arrivalList: string[][] }) {
  return (
    <table className={styles.timetable}>
      <thead className={styles.timetable__head}>
        <tr>
          <th className={styles.timetable__cell}>{headers[0]}</th>
          <th className={styles.timetable__cell}>{headers[1]}</th>
        </tr>
      </thead>

      <tbody className={styles.timetable__body}>
        {arrivalList.map((arrival) => (
          <tr className={styles.timetable__row} key={`${arrival[0]} - ${arrival[1]}`}>
            <td className={styles.timetable__cell}>{arrival[0]}</td>
            <td className={styles.timetable__cell}>{arrival[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ShuttleTimetable() {
  const { data: timetable, handleCourseChange } = useBusTimetable(SHUTTLE_COURSES);
  const [selectedRoute, handleRouteChange, resetRoute] = useIndexValueSelect();

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

          <Timetable
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
  const { data: timetable, handleCourseChange } = useBusTimetable(EXPRESS_COURSES);

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

          <Timetable
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

      <Timetable headers={BUS_TYPES[2].tableHeaders} arrivalList={CITY_BUS_TIMETABLE} />
    </>
  );
}

function BusTimetable() {
  const [selectedTab, setSelectedTab] = useState(BUS_TYPES[0]);

  return (
    <section className={styles.template}>
      <h2 className={styles.template__title}>전체 시간표 조회</h2>

      <nav>
        <ul className={styles.tabs}>
          {BUS_TYPES.map((type) => (
            <li key={type.key}>
              <button
                type="button"
                onClick={() => setSelectedTab(type)}
                className={cn({
                  [styles.tabs__tab]: true,
                  [styles['tabs__tab--selected']]: selectedTab.key === type.key,
                })}
              >
                {type.tabName}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <Suspense fallback={<LoadingSpinner className={styles['template__loading-spinner']} />}>
        {selectedTab.key === 'shuttle' && <ShuttleTimetable />}
        {selectedTab.key === 'express' && <ExpressTimetable />}
        {selectedTab.key === 'city' && <CityTimetable />}
      </Suspense>
    </section>
  );
}

export default BusTimetable;
