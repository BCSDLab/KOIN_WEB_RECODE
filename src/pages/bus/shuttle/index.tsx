import { useState } from 'react';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import InformationIcon from 'assets/svg/Bus/info-gray.svg';
import RightArrow from 'assets/svg/right-arrow.svg';
import BusCoursePage from 'components/Bus/BusCoursePage';
import InfoFooter from 'components/Bus/BusCoursePage/components/InfoFooter';
import useBusTimetable from 'components/Bus/BusCoursePage/hooks/useBusTimetable';
import useIndexValueSelect from 'components/Bus/BusCoursePage/hooks/useIndexValueSelect';
import useShuttleCourse from 'components/Bus/BusCoursePage/hooks/useShuttleCourse';
import useCoopSemester from 'components/Bus/BusRoutePage/hooks/useCoopSemester';
import dayjs from 'dayjs';
import { BUS_FEEDBACK_FORM, EXPRESS_COURSES } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './ShuttleBusTimetable.module.scss';

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

const courseCategory = ['전체', '주중노선', '주말노선', '순환노선'];

function formatSemesterLabel(semester?: string) {
  if (!semester) return '';
  const parts = semester.split('-');
  return (parts[1] ?? parts[0]).trim();
}

function asString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function ShuttleBusTimetable() {
  const router = useRouter();
  const categoryFromURL = asString(router.query.category);

  const logger = useLogger();
  const isMobile = useMediaQuery();

  const { data: semesterData } = useCoopSemester();
  const { shuttleCourse } = useShuttleCourse();
  const [selectedCourseId] = useIndexValueSelect();
  const timetable = useBusTimetable(EXPRESS_COURSES[selectedCourseId]);

  const [category, setCategory] = useState(categoryFromURL || '전체');

  const displaySemester = formatSemesterLabel(semesterData.semester);

  return (
    <BusCoursePage>
      <div className={styles['timetable-container']}>
        {/* 카테고리 버튼 */}
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
                router.replace({
                  pathname: '/bus/shuttle',
                  query: { category: value },
                });
                logger.actionEventClick({
                  team: 'CAMPUS',
                  event_label: 'shuttle_bus_route',
                  value,
                });
              }}
            >
              {value}
            </button>
          ))}
        </div>

        {/* 지역별 리스트 */}
        {!isMobile ? (
          <div className={styles['main-timetable']}>
            <div className={styles['main-timetable__column']}>
              {[
                shuttleCourse.route_regions[0], // 천안, 아산
                shuttleCourse.route_regions[1], // 청주
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
                shuttleCourse.route_regions[2], // 서울
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
              <TemplateShuttleVersion key={text.region} region={text.region} routes={text.routes} category={category} />
            ))}
            <div className={styles['info-footer-mobile']}>
              <div className={styles['info-footer-mobile__text']}>
                {displaySemester}({semesterData.from_date} ~ {semesterData.to_date}
                )
                <br />
                시간표가 제공됩니다.
              </div>
              <button
                type="button"
                className={styles['info-footer__icon']}
                onClick={() => {
                  window.open(BUS_FEEDBACK_FORM);
                  logger.actionEventClick({
                    team: 'CAMPUS',
                    event_label: 'error_feedback_button',
                    value: `셔틀_${category}`,
                  });
                }}
              >
                <InformationIcon />
                <div className={styles['info-footer__text']}>정보가 정확하지 않나요?</div>
              </button>
            </div>
          </div>
        )}

        {!isMobile && (
          <InfoFooter
            type="SHUTTLE"
            updated={dayjs(timetable.info.updated_at).format('YYYY-MM-DD')}
            category={category}
          />
        )}
      </div>
    </BusCoursePage>
  );
}

function TemplateShuttleVersion({ region, routes, category }: TemplateShuttleVersionProps) {
  const isMobile = useMediaQuery();
  const router = useRouter();
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
              router.push({
                pathname: `/bus/shuttle/${route.id}`,
                query: { category },
              });
              logger.actionEventClick({
                team: 'CAMPUS',
                event_label: 'area_specific_route',
                value: `${route.type}_${route.route_name}`,
              });
            }}
          >
            <span className={styles['template-shuttle__list']}>
              <div className={styles['template-shuttle__list_header']}>
                <span className={`${styles['template-shuttle__list_type']} ${styles[`type-${route.type}`]}`}>
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
