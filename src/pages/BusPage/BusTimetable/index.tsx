import { Suspense, useState } from 'react';
import cn from 'utils/ts/classnames';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import { BUS_TYPES } from 'static/bus';
import styles from './BusTimetable.module.scss';

function Timetable({ headers }: { headers: string[] }) {
  return (

    <table className={styles.timetable}>
      <thead className={styles.timetable__head}>
        <tr>
          <th className={styles.timetable__cell}>{headers[0]}</th>
          <th className={styles.timetable__cell}>{headers[1]}</th>
        </tr>
      </thead>

      <tbody className={styles.timetable__body}>
        <tr className={styles.timetable__row}>
          <td className={styles.timetable__cell}>ㅇㅅㅇ</td>
          <td className={styles.timetable__cell}>ㅇㅅㅇ</td>
        </tr>
      </tbody>
    </table>
  );
}

function ShuttleTimetable() {
  return (
    <>
      <div className={styles['timetable__dropdown-wrapper']}>
        <select className={styles.timetable__dropdown}>
          <option value="temp">천안 하교</option>
        </select>
        <select className={styles.timetable__dropdown}>
          <option value="temp">천안역</option>
          <option value="temp">천안역천안역천안역</option>
        </select>
      </div>

      <Timetable headers={BUS_TYPES[0].tableHeaders} />
    </>
  );
}

function ExpressTimetable() {
  return (
    <>
      <div className={styles['timetable__dropdown-wrapper']}>
        <select className={styles.timetable__dropdown}>
          <option value="temp">천안 하교</option>
        </select>
      </div>

      <Timetable headers={BUS_TYPES[1].tableHeaders} />
    </>
  );
}

function CityTimetable() {
  return (
    <>
      <div className={styles['timetable__citybus-info']}>
        버스번호: 400, 401
      </div>

      <Timetable headers={BUS_TYPES[2].tableHeaders} />
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
