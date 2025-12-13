import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getShuttleCourseInfo } from 'api/bus';
import InformationIcon from 'assets/svg/Bus/info-gray.svg';
import RightArrow from 'assets/svg/right-arrow.svg';
import BusCoursePage, { useBusCourse } from 'components/Bus/BusCoursePage';
import InfoFooter from 'components/Bus/BusCoursePage/components/InfoFooter';
import { ShuttleCategoryTabs } from 'components/Bus/BusCoursePage/components/ShuttleCategoryTabs';
import useBusPrefetch from 'components/Bus/BusCoursePage/hooks/useBusPrefetch';
import { useClientShuttleTimetable } from 'components/Bus/BusCoursePage/hooks/useBusTimetable';
import useShuttleCourse from 'components/Bus/BusCoursePage/hooks/useShuttleCourse';
import { SSRLayout } from 'components/layout';
import dayjs from 'dayjs';
import { BUS_FEEDBACK_FORM, SHUTTLE_COURSES } from 'static/bus';
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

function asString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['bus', 'courses', 'shuttle'],
    queryFn: getShuttleCourseInfo,
    staleTime: 1000 * 60 * 10,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function ShuttleBusTimetable() {
  const router = useRouter();
  const categoryFromURL = asString(router.query.category);
  const category = categoryFromURL ?? '전체';

  const logger = useLogger();
  const { isMobile } = useBusCourse();

  const { shuttleCourse } = useShuttleCourse();

  const { data: timetable } = useClientShuttleTimetable(SHUTTLE_COURSES[0]);

  const displaySemester = shuttleCourse.semester_info.name;
  const updatedAt = timetable?.updated_at;

  return (
    <BusCoursePage>
      <div className={styles['timetable-container']}>
        {/* 카테고리 버튼 */}
        <ShuttleCategoryTabs
          category={category}
          onChange={(v) => {
            if (v === '전체') {
              router.replace('/bus/shuttle', undefined, { shallow: true });
            } else {
              router.replace(
                {
                  pathname: '/bus/shuttle',
                  query: { category: v },
                },
                undefined,
                { shallow: true },
              );
            }
          }}
        />

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
                {displaySemester}({shuttleCourse.semester_info.from} ~ {shuttleCourse.semester_info.to}
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

        {!isMobile && updatedAt && (
          <InfoFooter type="SHUTTLE" updated={dayjs(updatedAt).format('YYYY-MM-DD')} category={category} />
        )}
      </div>
    </BusCoursePage>
  );
}

function TemplateShuttleVersion({ region, routes, category }: TemplateShuttleVersionProps) {
  const router = useRouter();
  const isMobile = useMediaQuery();
  const logger = useLogger();

  const prefetchBusTimetable = useBusPrefetch();

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
            key={route.id}
            type="button"
            onMouseEnter={() => {
              prefetchBusTimetable({
                type: 'shuttle_detail',
                id: route.id,
              });
            }}
            className={styles['template-shuttle__list_wrapper']}
            onClick={() => {
              logger.actionEventClick({
                team: 'CAMPUS',
                event_label: 'area_specific_route',
                value: `${route.type}_${route.route_name}`,
              });
              router.push({
                pathname: `/bus/shuttle/${route.id}`,
                query: { category },
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

ShuttleBusTimetable.getLayout = (page: React.ReactNode) => <SSRLayout>{page}</SSRLayout>;
