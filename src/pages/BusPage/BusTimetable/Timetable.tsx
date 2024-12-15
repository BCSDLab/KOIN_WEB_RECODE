import { getCourseName } from 'pages/BusPage/ts/busModules';
import useBusTimetable, { useCityBusTimetable } from 'pages/BusPage/hooks/useBusTimetable';
import useIndexValueSelect from 'pages/BusPage/hooks/useIndexValueSelect';
import {
  BUS_TYPES, cityBusDirections, CITY_COURSES,
  EXPRESS_COURSES, SHUTTLE_COURSES, TERMINAL_CITY_BUS,
} from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import { ChangeEvent, useState } from 'react';
import dayjs from 'dayjs';
import useShuttleCourse from 'pages/BusPage/hooks/useShuttleCourse';
import { validateHeaderName } from 'http';
import RightArrow from 'assets/svg/right-arrow.svg';
import styles from './BusTimetable.module.scss';

interface TemplateShuttleVersionProps {
  region: string;
  routes: {
    route_name: string;
    sub_name: string | null;
    type: string;
  }[];
  category: string;
}

function Template({ headers, arrivalList }: { headers: string[], arrivalList: string[][] }) {
  return (
    <table className={styles.timetable} aria-expanded="true">
      <thead className={styles.timetable__head}>
        <tr>
          <th className={styles.timetable__label}>{headers[0]}</th>
          <th className={styles.timetable__label}>{headers[1]}</th>
        </tr>
      </thead>

      <tbody className={styles.timetable__body}>
        {arrivalList.map(([arrival, time], idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <tr className={styles.timetable__row} key={`${arrival} - ${time} - ${idx}`}>
            <td className={styles.timetable__cell_am}>{arrival}</td>
            <td className={styles.timetable__cell_pm}>{time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TemplateShuttleVersion({ region, routes, category }: TemplateShuttleVersionProps) {
  if (category === '전체') {
    return (
      <div className={styles.templateShuttle}>
        <h2 className={styles.templateShuttle__title}>{region}</h2>
        <div>
          {routes.map((route) => (
            <div className={styles.templateShuttle__list_wrapper}>
              <span className={styles.templateShuttle__list}>
                <div className={styles.templateShuttle__list_header}>
                  <span
                    className={`${styles.templateShuttle__list_type} ${styles[`type-${route.type}`]}`}
                  >
                    {route.type}
                  </span>
                  <span className={styles.templateShuttle__list_name}>{route.route_name}</span>
                </div>
                <div className={styles.templateShuttle__list_sub_name}>{route.sub_name}</div>
              </span>
              <RightArrow />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (category === '주중노선') {
    return (
      <div className={styles.templateShuttle}>
        <h2 className={styles.templateShuttle__title}>{region}</h2>
        <div>
          {(routes.filter((route) => route.type === '주중')).map((value) => (
            <div className={styles.templateShuttle__list_wrapper}>
              <span className={styles.templateShuttle__list}>
                <div className={styles.templateShuttle__list_header}>
                  <span
                    className={`${styles.templateShuttle__list_type} ${styles[`type-${value.type}`]}`}
                  >
                    {value.type}
                  </span>
                  <span className={styles.templateShuttle__list_name}>{value.route_name}</span>
                </div>
                <div className={styles.templateShuttle__list_sub_name}>{value.sub_name}</div>
              </span>
              <RightArrow />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (category === '주말노선') {
    return (
      <div className={styles.templateShuttle}>
        <h2 className={styles.templateShuttle__title}>{region}</h2>
        <div>
          {(routes.filter((route) => route.type === '주말')).map((value) => (
            <div className={styles.templateShuttle__list_wrapper}>
              <span className={styles.templateShuttle__list}>
                <div className={styles.templateShuttle__list_header}>
                  <span
                    className={`${styles.templateShuttle__list_type} ${styles[`type-${value.type}`]}`}
                  >
                    {value.type}
                  </span>
                  <span className={styles.templateShuttle__list_name}>{value.route_name}</span>
                </div>
                <div className={styles.templateShuttle__list_sub_name}>{value.sub_name}</div>
              </span>
              <RightArrow />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.templateShuttle}>
      <h2 className={styles.templateShuttle__title}>{region}</h2>
      <div>
        {(routes.filter((route) => route.type === '순환')).map((value) => (
          <div className={styles.templateShuttle__list_wrapper}>
            <span className={styles.templateShuttle__list}>
              <div className={styles.templateShuttle__list_header}>
                <span
                  className={`${styles.templateShuttle__list_type} ${styles[`type-${value.type}`]}`}
                >
                  {value.type}
                </span>
                <span className={styles.templateShuttle__list_name}>{value.route_name}</span>
              </div>
              <div className={styles.templateShuttle__list_sub_name}>{value.sub_name}</div>
            </span>
            <RightArrow />
          </div>
        ))}
      </div>
    </div>
  );
}

function ShuttleTimetable() {
  const [selectedCourseId, handleCourseChange] = useIndexValueSelect();
  const [selectedRoute, handleRouteChange, resetRoute] = useIndexValueSelect();
  const timetable = useBusTimetable(SHUTTLE_COURSES[selectedCourseId]);
  const logger = useLogger();
  const { shuttleCourse } = useShuttleCourse();
  const courseCategory = ['전체', '주중노선', '주말노선', '순환노선'];
  const [category, setCategory] = useState('전체');

  return (
    <div>
      <div className={styles.courseCategory}>
        {courseCategory.map((value) => (
          <button className={styles.courseCategory__button} type="button" onClick={() => setCategory(value)}>{value}</button>
        ))}
      </div>

      <div className={styles.layoutGrid}>
        {[
          shuttleCourse.route_regions[0], // 천안, 아산
          shuttleCourse.route_regions[2], // 서울
          shuttleCourse.route_regions[1], // 청주
          shuttleCourse.route_regions[3], // 대전, 세종
        ].map((text) => (
          <TemplateShuttleVersion
            key={text.region}
            region={text.region}
            routes={text.routes}
            category={category}
          />
        ))}
      </div>

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
  const destination = ['병천방면', '천안방면'];
  const [destinationCategory, setDestinationCategory] = useState('병천방면');

  function isAM(time: string): boolean {
    const [hour] = time.split(':').map(Number);
    return hour < 12;
  }

  const amList = timetable.info.bus_timetables
    .filter((info) => isAM(info.departure))
    .map((info) => info.departure);

  const pmList = timetable.info.bus_timetables
    .filter((info) => !isAM(info.departure))
    .map((info) => info.departure);

  const maxLength = Math.max(amList.length, pmList.length);
  const arrivalList = Array.from({ length: maxLength }, (_, idx) => [
    amList[idx] || '',
    pmList[idx] || '',
  ]);

  return (
    <div>

      <div className={styles.courseCategory}>
        <div className={styles.courseCategory__button}>기점</div>
        {destination.map((value) => (
          <button className={styles.courseCategory__button} type="button" onClick={() => setDestinationCategory(value)}>{value}</button>
        ))}
      </div>

      <Template
        headers={BUS_TYPES[1].tableHeaders}
        arrivalList={arrivalList}
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

  const busNumber = [400, 405, 495];
  const [busNumberCategory, setBusNumberCategory] = useState(400);
  const cityDeraction = ['병천방면', '천안방면'];
  const [destinationCity, setDestinationCity] = useState('병천방면');

  return (
    <>

      <div>

        <div className={styles.courseCategory}>
          <div className={styles.courseCategory__button}>노선</div>
          {getBusNumbersBySelectedDirection().map((value) => (
            <button className={styles.courseCategory__button} type="button" onClick={() => setBusNumberCategory(value)}>{value}</button>
          ))}
        </div>
        <div className={styles.courseCategory}>
          <div className={styles.courseCategory__button}>운행</div>
          {cityDeraction.map((value) => (
            <button className={styles.courseCategory__button} type="button" onClick={() => setDestinationCity(value)}>{value}</button>
          ))}
        </div>

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
