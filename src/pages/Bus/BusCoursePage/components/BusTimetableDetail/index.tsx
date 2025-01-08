import { useEffect, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import BusIcon from 'assets/svg/Bus/bus-icon-32x32.svg';
import InfomationIcon from 'assets/svg/Bus/info-gray.svg';
import useShuttleTimetableDetail from 'pages/Bus/BusCoursePage/hooks/useShuttleTimetableDetail';
import { useSearchParams } from 'react-router-dom';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './BusTimetableDetail.module.scss';

export default function BusTimetableDetail() {
  const [searchParams] = useSearchParams();
  const routeId = searchParams.get('routeId');
  const { shuttleTimetableDetail } = useShuttleTimetableDetail(routeId || null);
  const [selectedDetail, setSelectedDetail] = useState<string | null>('');
  const isMobile = useMediaQuery();
  const logger = useLogger();

  useEffect(() => {
    if (shuttleTimetableDetail) {
      setSelectedDetail(shuttleTimetableDetail.route_info[0].name);
    }
  }, [shuttleTimetableDetail]);

  if (!shuttleTimetableDetail) return null;

  const rowLength = shuttleTimetableDetail.node_info.length + 1;

  return (
    <>
      {shuttleTimetableDetail.route_info.length <= 2 && (
        <div className={styles['time-table-wrapper']}>
          <div className={styles['time-table-title']}>
            <div className={styles['bus-icon']}>
              {!isMobile && <BusIcon />}
              <div
                className={`${styles['bus-type']} ${styles[`type-${shuttleTimetableDetail.route_type}`]}`}
              >
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
                      [styles['detail__button--selected']]: selectedDetail === name,
                    })}
                    onClick={() => {
                      setSelectedDetail(name);
                      logger.actionEventClick({
                        actionTitle: 'CAMPUS',
                        title: name === '등교' ? 'go_to_school' : 'go_home',
                        event_category: 'click',
                        value: `${shuttleTimetableDetail.route_type}_${shuttleTimetableDetail.route_type}`,
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
                    [styles['detail__button--selected']]: selectedDetail === name,
                  })}
                  onClick={() => setSelectedDetail(name)}
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
                .filter(({ name }) => selectedDetail === name)
                ?.map(({ name, detail, arrival_time }) => (
                  <>
                    <div className={styles['time-table__number']}>
                      {name}
                      {detail}
                    </div>
                    {arrival_time.map((time) => (
                      <div className={styles['time-table__time']}>
                        {time ? time.split('/')[0] : time}
                      </div>
                    ))}
                  </>
                ))}

              <div className={styles['time-table__number']}>승하차장명</div>

              {shuttleTimetableDetail.node_info.map(({ name, detail }) => (
                <div className={styles['time-table__node-wrapper']}>
                  <div className={styles['time-table__node']}>
                    <div>{name}</div>
                    {detail && <div className={styles['time-table__node-detail']}>{detail}</div>}
                  </div>
                </div>
              ))}
            </div>

            {isMobile && (
              <div className={styles['info-footer-mobile-detail']}>
                <InfomationIcon />
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
              <div
                className={`${styles['bus-type']} ${styles[`type-${shuttleTimetableDetail.route_type}`]}`}
              >
                {shuttleTimetableDetail.route_type}
              </div>
            </div>
            <div className={styles.header__title}>{shuttleTimetableDetail.route_name} 시간표</div>
            {shuttleTimetableDetail.sub_name && (
              <div className={styles.header__subtitle}>{shuttleTimetableDetail.sub_name}</div>
            )}
          </div>

          <div
            className={styles['time-table']}
            style={{ gridTemplateRows: `repeat(${rowLength}, 1fr)` }}
          >
            <div className={styles['time-table__number']}>승하차장명</div>
            {shuttleTimetableDetail.node_info.map(({ name, detail }) => (
              <div className={`${styles['time-table__node']} ${styles['time-table__node--long']}`}>
                <div>{name}</div>
                {detail && <div className={styles['time-table__node-detail']}>{detail}</div>}
              </div>
            ))}

            {shuttleTimetableDetail.route_info.map(({ name, detail, arrival_time }) => (
              <>
                <div className={styles['time-table__number']}>
                  {name}
                  {detail}
                </div>
                {arrival_time.map((time) => (
                  <div className={styles['time-table__time']}>
                    {time ? time.split('/')[0] : time}
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
