import BusTimetableDetail from 'pages/BusCoursePage/BusTimetableDetail';
import useIndexValueSelect from 'pages/BusCoursePage/hooks/useIndexValueSelect';
import { useState } from 'react';
import useShuttleCourse from 'pages/BusCoursePage/hooks/useShuttleCourse';
import useBusTimetable, { useCityBusTimetable } from 'pages/BusCoursePage/hooks/useBusTimetable';
import RightArrow from 'assets/svg/right-arrow.svg';
import dayjs from 'dayjs';
import { cn } from '@bcsdlab/utils';
import {
  BUS_TYPES,
  cityBusDirections,
  CITY_COURSES,
  EXPRESS_COURSES,
  TERMINAL_CITY_BUS,
} from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import InfomationIcon from 'assets/svg/info-gray.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './BusTimetable.module.scss';

interface TemplateShuttleVersionProps {
  routeIdHandler: (id: string | null) => void,
  region: string;
  routes: {
    id: string;
    route_name: string;
    sub_name: string | null;
    type: string;
  }[];
  category: string;
}

function TemplateShuttleVersion({
  routeIdHandler,
  region,
  routes,
  category,
}: TemplateShuttleVersionProps) {
  const filteredRoutes = (route: string) => routes.filter(({ type }) => {
    if (route === '전체') {
      return true;
    }

    if (route === '주중노선') {
      return type === '주중';
    }

    if (route === '주말노선') {
      return type === '주말';
    }

    if (route === '순환노선') {
      return type === '순환';
    }

    return false;
  });

  if (filteredRoutes(category).length === 0) {
    return null;
  }

  return (
    <div className={styles.templateShuttle}>
      <h2 className={styles.templateShuttle__title}>{region}</h2>
      <div>
        {filteredRoutes(category).map((route, idx) => (
          <button
            type="button"
            className={styles.templateShuttle__list_wrapper}
            key={route.id}
            onClick={() => routeIdHandler(route.id)}
          >
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
          </button>
        ))}
        <div className={styles['main-timetable-mobile__line']} />
      </div>
    </div>
  );
}

function ShuttleTimetable() {
  const { shuttleCourse } = useShuttleCourse();
  const [selectedCourseId, handleCourseChange] = useIndexValueSelect();
  const timetable = useBusTimetable(EXPRESS_COURSES[selectedCourseId]);
  const isMobile = useMediaQuery();
  const courseCategory = ['전체', '주중노선', '주말노선', '순환노선'];
  const [category, setCategory] = useState('전체');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const changeRouteId = async (id: string | null) => {
    setSelectedRouteId(id);
  };

  console.log(shuttleCourse.route_regions);
  return (
    <div className={styles['timetable-container']}>
      <div className={styles['course-category']}>
        {courseCategory.map((value) => (
          <button
            key={value}
            className={cn({
              [styles['course-category__button']]: true,
              [styles['course-category__button--selected']]: value === category,
            })}
            type="button"
            onClick={() => {
              setCategory(value);
              setSelectedRouteId(null);
            }}
          >
            {value}
          </button>
        ))}
      </div>

      {!selectedRouteId && (
        !isMobile ? (
          <div className={styles['main-timetable']}>
            <div className={styles['main-timetable__column']}>
              {[
                shuttleCourse.route_regions[0], // 천안, 아산
                shuttleCourse.route_regions[2], // 서울
              ].map((text) => (
                <TemplateShuttleVersion
                  routeIdHandler={changeRouteId}
                  key={text.region}
                  region={text.region}
                  routes={text.routes}
                  category={category}
                />
              ))}
            </div>
            <div className={styles['main-timetable__column']}>
              {[
                shuttleCourse.route_regions[1], // 청주
                shuttleCourse.route_regions[3], // 대전, 세종
              ].map((text) => (
                <TemplateShuttleVersion
                  routeIdHandler={changeRouteId}
                  key={text.region}
                  region={text.region}
                  routes={text.routes}
                  category={category}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles['main-timetable-mobile']}>
            {shuttleCourse.route_regions.map((text) => (
              <TemplateShuttleVersion
                routeIdHandler={changeRouteId}
                key={text.region}
                region={text.region}
                routes={text.routes}
                category={category}
              />
            ))}
            <div className={styles['info-footer-mobile']}>
              <div className={styles['info-footer-mobile__text']}>
                정규학기(2024년 9월 2일 ~ 12월 20일)의
                <br />
                시간표가 제공됩니다.
              </div>
              <div className={styles['info-footer-mobile__icon']}>
                <InfomationIcon />
                <div>
                  정보가 정확하지 않나요?
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {selectedRouteId && <BusTimetableDetail routeId={selectedRouteId} />}

      {!isMobile && (
        <div className={styles['info-footer']}>
          <div className={styles['info-footer__date']}>
            <div>
              업데이트 날짜 :
            </div>
            <div>
              {dayjs(timetable.info.updated_at).format('YYYY-MM-DD')}
            </div>
          </div>
          <div className={styles['info-footer__icon']}>
            <InfomationIcon />
            <div>
              정보가 정확하지 않나요?
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Template({ headers, arrivalList }: { headers: string[], arrivalList: string[][] }) {
  return (
    <div className={styles.timetable} aria-expanded="true">
      <div className={styles['timetable__label-wrapper']}>
        <div className={styles.timetable__label}>오전</div>
        <div className={styles.timetable__label}>오후</div>
      </div>
      {arrivalList.map(([arrival, time], idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className={styles.timetable__row} key={`${arrival} - ${time} - ${idx}`}>
          <span className={styles.timetable__cell_am}>{arrival}</span>
          <span className={styles.timetable__cell_pm}>{time}</span>
        </div>
      ))}
    </div>
  );
}

function ExpressTimetable() {
  const [selectedCourseId, handleCourseChange] = useIndexValueSelect();
  const timetable = useBusTimetable(EXPRESS_COURSES[selectedCourseId]);
  const [destinationCategory, setDestinationCategory] = useState('병천방면');
  const logger = useLogger();

  return (
    <div className={styles['timetable-container']}>
      <div className={styles['course-category']}>
        <div className={styles['course-category__button']}>운행</div>
        {EXPRESS_COURSES.map((value, index) => (
          <button
            className={cn({
              [styles['course-category__button']]: true,
              [styles['course-category__button--selected']]: value.name === destinationCategory,
            })}
            type="button"
            onClick={(e) => {
              setDestinationCategory(value.name);
              handleCourseChange(e);
              logger.actionEventClick({
                actionTitle: 'CAMPUS',
                title: 'bus_timetable_express',
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
        headers={BUS_TYPES[1].tableHeaders}
        // arrivalList={timetable.info.bus_timetables.map((info) => [info.departure, info.arrival])}
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
          return Array.from({ length: maxLength }, (_, idx) => [
            morning[idx] || '',
            afternoon[idx] || '',
          ]);
        })()}
      />
      <div className={styles['express-footer']}>
        <div className={styles['express-footer__date']}>
          업데이트 날짜:
          {dayjs(timetable.info.updated_at).format('YYYY-MM-DD')}
        </div>
        <div className={styles['express-footer__icon']}>
          <InfomationIcon />
          <div>
            정보가 정확하지 않나요?
          </div>
        </div>
      </div>
    </div>
  );
}

function CityTimetable() {
  const [selectedDirection, setSelectedDirection] = useState(cityBusDirections[0].value);
  const [selectedBusNumber, setSelectedBusNumber] = useState(CITY_COURSES[0].bus_number);
  const logger = useLogger();

  const timetable = useCityBusTimetable({
    bus_number: selectedBusNumber,
    direction: selectedDirection === 'to'
      ? CITY_COURSES.find((course) => course.bus_number === selectedBusNumber && course.direction !== TERMINAL_CITY_BUS)?.direction || ''
      : TERMINAL_CITY_BUS,
  });

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
    <div className={styles['timetable-city-container']}>
      <div className={styles['course-category-city-container']}>
        <div className={styles['course-category-city']}>
          <div className={styles['course-category__button']}>노선</div>
          {CITY_COURSES.slice(0, 3).map((cityCourse) => (
            <button
              className={cn({
                [styles['course-category__button']]: true,
                [styles['course-category__button--selected']]: cityCourse.bus_number === selectedBusNumber,
              })}
              type="button"
              onClick={() => {
                setSelectedBusNumber(cityCourse.bus_number);
                logger.actionEventClick({
                  actionTitle: 'CAMPUS',
                  title: 'bus_timetable_citybus_route',
                  value: `${cityCourse.bus_number}번`,
                });
              }}
            >
              {cityCourse.bus_number}
              번
            </button>
          ))}
        </div>
        <div className={styles['course-category-city']}>
          <div className={styles['course-category__button']}>운행</div>
          {cityBusDirections.map((cityBusDirection) => (
            <button
              className={cn({
                [styles['course-category__button']]: true,
                [styles['course-category__button--selected']]: cityBusDirection.value === selectedDirection,
              })}
              type="button"
              onClick={() => {
                setSelectedDirection(cityBusDirection.value);
                logger.actionEventClick({
                  actionTitle: 'CAMPUS',
                  title: 'bus_timetable_citybus',
                  value: cityBusDirection.value,
                });
              }}
            >
              {cityBusDirection.label}
            </button>
          ))}
        </div>
      </div>
      <Template
        headers={BUS_TYPES[2].tableHeaders}
        arrivalList={getTodayTimetable()}
      />

      <div className={styles['express-footer']}>
        <div className={styles['express-footer__date']}>
          업데이트 날짜:
          {dayjs(timetable.info.updated_at).format('YYYY-MM-DD')}
        </div>
        <div className={styles['express-footer__icon']}>
          <InfomationIcon />
          <div>
            정보가 정확하지 않나요?
          </div>
        </div>
      </div>
    </div>
  );
}

export default {
  Shuttle: ShuttleTimetable,
  Express: ExpressTimetable,
  City: CityTimetable,
};
