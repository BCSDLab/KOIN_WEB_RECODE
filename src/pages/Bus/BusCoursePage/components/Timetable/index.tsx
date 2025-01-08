import { useState } from 'react';
import { cn } from '@bcsdlab/utils';
import InfomationIcon from 'assets/svg/Bus/info-gray.svg';
import RightArrow from 'assets/svg/right-arrow.svg';
import dayjs from 'dayjs';
import BusTimetableDetail from 'pages/Bus/BusCoursePage/components/BusTimetableDetail';
import useBusTimetable, {
  useCityBusTimetable,
} from 'pages/Bus/BusCoursePage/hooks/useBusTimetable';
import useIndexValueSelect from 'pages/Bus/BusCoursePage/hooks/useIndexValueSelect';
import useShuttleCourse from 'pages/Bus/BusCoursePage/hooks/useShuttleCourse';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BUS_FEEDBACK_FORM,
  BUS_TYPES,
  cityBusDirections,
  CITY_COURSES,
  EXPRESS_COURSES,
  TERMINAL_CITY_BUS,
} from 'static/bus';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './Timetable.module.scss';

interface TemplateShuttleVersionProps {
  region: string;
  routes: {
    id: string;
    route_name: string;
    sub_name: string | null;
    type: string;
  }[];
  category: string;
}

function TemplateShuttleVersion({ region, routes, category }: TemplateShuttleVersionProps) {
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const logger = useLogger();
  const filteredRoutes = (route: string) =>
    routes.filter(({ type }) => {
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
    <div className={styles['template-shuttle']}>
      <h2 className={styles['template-shuttle__title']}>{region}</h2>
      <div>
        {filteredRoutes(category).map((route) => (
          <button
            type="button"
            className={styles['template-shuttle__list_wrapper']}
            key={route.id}
            onClick={() => {
              navigate(`/bus/course?routeId=${route.id}`);
              logger.actionEventClick({
                actionTitle: 'CAMPUS',
                title: 'area_specific_route',
                event_category: 'click',
                value: `${route.type}_${route.route_name}`,
              });
            }}
          >
            <span className={styles['template-shuttle__list']}>
              <div className={styles['template-shuttle__list_header']}>
                <span
                  className={`${styles['template-shuttle__list_type']} ${styles[`type-${route.type}`]}`}
                >
                  {route.type}
                </span>
                <span className={styles['template-shuttle__list_name']}>{route.route_name}</span>
              </div>
              <div className={styles['template-shuttle__list_sub_name']}>{route.sub_name}</div>
            </span>
            <RightArrow />
          </button>
        ))}
        {isMobile && <div className={styles['main-timetable-mobile__line']} />}
      </div>
    </div>
  );
}

function ShuttleTimetable() {
  const { shuttleCourse } = useShuttleCourse();
  const logger = useLogger();
  const [selectedCourseId] = useIndexValueSelect();
  const [searchParams] = useSearchParams();
  const routeId = searchParams.get('routeId');
  const navigate = useNavigate();
  const timetable = useBusTimetable(EXPRESS_COURSES[selectedCourseId]);
  const isMobile = useMediaQuery();
  const courseCategory = ['전체', '주중노선', '주말노선', '순환노선'];
  const [category, setCategory] = useState('전체');

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
              navigate(ROUTES.BusCourse());
              logger.actionEventClick({
                actionTitle: 'CAMPUS',
                title: 'shuttle_bus_route',
                event_category: 'click',
                value,
              });
            }}
          >
            {value}
          </button>
        ))}
      </div>

      {!routeId &&
        (!isMobile ? (
          <div className={styles['main-timetable']}>
            <div className={styles['main-timetable__column']}>
              {[
                shuttleCourse.route_regions[0], // 천안, 아산
                shuttleCourse.route_regions[2], // 서울
              ].map((text) => (
                <TemplateShuttleVersion
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
              <button
                type="button"
                className={styles['info-footer__icon']}
                onClick={() => {
                  window.open(BUS_FEEDBACK_FORM);
                  logger.actionEventClick({
                    actionTitle: 'CAMPUS',
                    title: 'error_feedback_button',
                    value: `셔틀_${category}`,
                  });
                }}
              >
                <InfomationIcon />
                <div className={styles['info-footer__text']}>정보가 정확하지 않나요?</div>
              </button>
            </div>
          </div>
        ))}

      {routeId && <BusTimetableDetail />}

      {!isMobile && (
        <div className={styles['info-footer']}>
          <div className={styles['info-footer__date']}>
            <div>업데이트 날짜 :</div>
            <div>{dayjs(timetable.info.updated_at).format('YYYY-MM-DD')}</div>
          </div>
          <button
            type="button"
            className={styles['info-footer__icon']}
            onClick={() => {
              window.open(BUS_FEEDBACK_FORM);
              logger.actionEventClick({
                actionTitle: 'CAMPUS',
                title: 'error_feedback_button',
                value: `셔틀_${category}`,
              });
            }}
          >
            <InfomationIcon />
            <div className={styles['info-footer__text']}>정보가 정확하지 않나요?</div>
          </button>
        </div>
      )}
    </div>
  );
}

function Template({ arrivalList }: { arrivalList: string[][] }) {
  return (
    <div className={styles.timetable} aria-expanded="true">
      <div className={styles['timetable__label-wrapper']}>
        <div className={styles.timetable__label}>{BUS_TYPES[1].tableHeaders[0]}</div>
        <div className={styles.timetable__label}>{BUS_TYPES[1].tableHeaders[1]}</div>
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
                title: 'ds_bus_direction',
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
        <button
          type="button"
          className={styles['info-footer__icon']}
          onClick={() => {
            window.open(BUS_FEEDBACK_FORM);
            logger.actionEventClick({
              actionTitle: 'CAMPUS',
              title: 'error_feedback_button',
              value: `대성_${destinationCategory}`,
            });
          }}
        >
          <InfomationIcon />
          <div className={styles['info-footer__text']}>정보가 정확하지 않나요?</div>
        </button>
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
    direction:
      selectedDirection === 'to'
        ? CITY_COURSES.find(
            (course) =>
              course.bus_number === selectedBusNumber && course.direction !== TERMINAL_CITY_BUS
          )?.direction || ''
        : TERMINAL_CITY_BUS,
  });

  const getTodayTimetable = () => {
    const today = dayjs().day();
    const dayType = today === 0 || today === 6 ? '주말' : '평일';

    const todayTimetable = timetable.info.bus_timetables.find(
      (info) => info.day_of_week === dayType
    );

    const getHours = (time: string) => parseInt(time.split(':')[0], 10);

    const fullTimetable = Array.from(
      {
        length: Math.max(
          todayTimetable?.depart_info.filter((time) => getHours(time) < 12).length || 0,
          todayTimetable?.depart_info.filter((time) => getHours(time) >= 12).length || 0
        ),
      },
      (_, idx) => [
        todayTimetable?.depart_info.filter((time) => getHours(time) < 12)[idx] || '',
        todayTimetable?.depart_info.filter((time) => getHours(time) >= 12)[idx] || '',
      ]
    );

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
                [styles['course-category__button--selected']]:
                  cityCourse.bus_number === selectedBusNumber,
              })}
              type="button"
              onClick={() => {
                setSelectedBusNumber(cityCourse.bus_number);
                logger.actionEventClick({
                  actionTitle: 'CAMPUS',
                  title: 'city_bus_route',
                  value: `${cityCourse.bus_number}번`,
                });
              }}
            >
              {cityCourse.bus_number}번
            </button>
          ))}
        </div>
        <div className={styles['course-category-city']}>
          <div className={styles['course-category__button']}>운행</div>
          {cityBusDirections.map((cityBusDirection) => (
            <button
              className={cn({
                [styles['course-category__button']]: true,
                [styles['course-category__button--selected']]:
                  cityBusDirection.value === selectedDirection,
              })}
              type="button"
              onClick={() => {
                setSelectedDirection(cityBusDirection.value);
                logger.actionEventClick({
                  actionTitle: 'CAMPUS',
                  title: 'city_bus_direction',
                  value: cityBusDirection.label,
                });
              }}
            >
              {cityBusDirection.label}
            </button>
          ))}
        </div>
      </div>
      <Template arrivalList={getTodayTimetable()} />

      <div className={styles['express-footer']}>
        <div className={styles['express-footer__date']}>
          업데이트 날짜:
          {dayjs(timetable.info.updated_at).format('YYYY-MM-DD')}
        </div>
        <button
          type="button"
          className={styles['info-footer__icon']}
          onClick={() => {
            window.open(BUS_FEEDBACK_FORM);
            logger.actionEventClick({
              actionTitle: 'CAMPUS',
              title: 'error_feedback_button',
              value: `시내_${selectedDirection}_${selectedBusNumber}`,
            });
          }}
        >
          <InfomationIcon />
          <div className={styles['info-footer__text']}>정보가 정확하지 않나요?</div>
        </button>
      </div>
    </div>
  );
}

export const Shuttle = ShuttleTimetable;
export const Express = ExpressTimetable;
export const City = CityTimetable;
