import { useState } from 'react';
import React from 'react';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import BusIcon from 'assets/svg/Bus/bus-icon-32x32.svg';
import InformationIcon from 'assets/svg/Bus/info-gray.svg';
import BusCoursePage from 'components/Bus/BusCoursePage';
import { ShuttleCategoryTabs } from 'components/Bus/BusCoursePage/components/ShuttleCategoryTabs';
import useShuttleTimetableDetail from 'components/Bus/BusCoursePage/hooks/useShuttleTimetableDetail';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './ShuttleDetailPage.module.scss';

function asString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function ShuttleDetailPage() {
  const router = useRouter();
  const { routeId } = router.query;

  const { shuttleTimetableDetail } = useShuttleTimetableDetail(
    routeId ? (Array.isArray(routeId) ? routeId[0] : routeId) : null,
  );

  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);

  const categoryFromURL = router.query.category;
  const category = asString(categoryFromURL) ?? '전체';

  const isMobile = useMediaQuery();
  const logger = useLogger();

  if (!shuttleTimetableDetail) return null;

  const rowLength = shuttleTimetableDetail.node_info.length + 1;
  const fallbackName = shuttleTimetableDetail.route_info[0]?.name ?? '';
  const selectedName = selectedDetail ?? fallbackName;

  return (
    <BusCoursePage>
      {/* 카테고리 버튼 */}
      <ShuttleCategoryTabs category={category} onChange={(v) => router.replace(`/bus/shuttle?category=${v}`)} />

      {shuttleTimetableDetail.route_info.length <= 2 && (
        <div className={styles['time-table-wrapper']}>
          <div className={styles['time-table-title']}>
            <div className={styles['bus-icon']}>
              {!isMobile && <BusIcon />}
              <div className={`${styles['bus-type']} ${styles[`type-${shuttleTimetableDetail.route_type}`]}`}>
                {shuttleTimetableDetail.route_type}
              </div>
            </div>
            <div className={styles.header__title}>{shuttleTimetableDetail.route_name} 시간표</div>
            {shuttleTimetableDetail.sub_name && (
              <div className={styles.header__subtitle}>{shuttleTimetableDetail.sub_name}</div>
            )}
            {!isMobile && ( // PC 뷰에서만 표시
              <div className={styles['detail__button-wrapper']}>
                {shuttleTimetableDetail.route_info.map(({ name }) => (
                  <button
                    type="button"
                    className={cn({
                      [styles.detail__button]: true,
                      [styles['detail__button--selected']]: selectedName === name,
                    })}
                    onClick={() => {
                      setSelectedDetail(name);
                      logger.actionEventClick({
                        team: 'CAMPUS',
                        event_label: name === '등교' ? 'go_to_school' : 'go_home',
                        value: `${shuttleTimetableDetail.route_type}_${shuttleTimetableDetail.route_name}`,
                      });
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 모바일 뷰에서는 time-table-title 밖으로 이동 */}
          {isMobile && (
            <div className={styles['detail__button-wrapper']}>
              {shuttleTimetableDetail.route_info.map(({ name }) => (
                <button
                  type="button"
                  className={cn({
                    [styles.detail__button]: true,
                    [styles['detail__button--selected']]: selectedName === name,
                  })}
                  onClick={() => {
                    setSelectedDetail(name);
                    logger.actionEventClick({
                      team: 'CAMPUS',
                      event_label: name === '등교' ? 'go_to_school' : 'go_home',
                      value: `${shuttleTimetableDetail.route_type}_${shuttleTimetableDetail.route_name}`,
                    });
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          <div className={styles['time-table-main-wrapper']}>
            <div
              className={`${styles['time-table']} ${styles['time-table--short']}`}
              style={{ gridTemplateRows: `repeat(${rowLength}, 1fr)` }}
            >
              {shuttleTimetableDetail.route_info
                .filter(({ name }) => selectedName === name)
                ?.map(({ name, detail, arrival_time }) => (
                  <React.Fragment key={name}>
                    <div className={styles['time-table__number']}>
                      {name}
                      {detail}
                    </div>
                    {arrival_time.map((time) => (
                      <div className={styles['time-table__time']}>{time ? time.split('/')[0] : time}</div>
                    ))}
                  </React.Fragment>
                ))}

              <div className={styles['time-table__number']}>승하차장명</div>

              {shuttleTimetableDetail.node_info.map(({ name, detail }) => (
                <div key={name} className={styles['time-table__node-wrapper']}>
                  <div className={styles['time-table__node']}>
                    <div>{name}</div>
                    {detail && <div className={styles['time-table__node-detail']}>{detail}</div>}
                  </div>
                </div>
              ))}
            </div>

            {isMobile && (
              <div className={styles['info-footer-mobile-detail']}>
                <InformationIcon />
                <div>정보가 정확하지 않나요?</div>
              </div>
            )}
          </div>
        </div>
      )}

      {shuttleTimetableDetail.route_info.length > 2 && (
        <div className={styles['time-table-wrapper']}>
          <div className={styles['time-table-title']}>
            <div className={styles['bus-icon']}>
              <BusIcon />
              <div className={`${styles['bus-type']} ${styles[`type-${shuttleTimetableDetail.route_type}`]}`}>
                {shuttleTimetableDetail.route_type}
              </div>
            </div>
            <div className={styles.header__title}>{shuttleTimetableDetail.route_name} 시간표</div>
            {shuttleTimetableDetail.sub_name && (
              <div className={styles.header__subtitle}>{shuttleTimetableDetail.sub_name}</div>
            )}
          </div>

          <div className={styles['time-table']} style={{ gridTemplateRows: `repeat(${rowLength}, 1fr)` }}>
            <div className={styles['time-table__number']}>승하차장명</div>
            {shuttleTimetableDetail.node_info.map(({ name, detail }) => (
              <div className={`${styles['time-table__node']} ${styles['time-table__node--long']}`}>
                <div>{name}</div>
                {detail && <div className={styles['time-table__node-detail']}>{detail}</div>}
              </div>
            ))}

            {shuttleTimetableDetail.route_info.map(({ name, detail, arrival_time }) => (
              <React.Fragment key={name}>
                <div className={styles['time-table__number']}>
                  {name}
                  <br />
                  {detail}
                </div>
                {arrival_time.map((time) => (
                  <div className={styles['time-table__time']}>{time ? time.split('/')[0] : time}</div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </BusCoursePage>
  );
}
