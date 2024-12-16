import useShuttleTimetableDetail from 'pages/BusTimetablePage/hooks/useShuttleTimetableDetail';
import { useEffect, useState } from 'react';
import BusIcon from 'assets/svg/bus.svg';
import { cn } from '@bcsdlab/utils';
import styles from './BusTimetableDetail.module.scss';

interface ShuttleTimetableDetailProps {
  routeId : string;
}

function BusTimetableDetail({ routeId }: ShuttleTimetableDetailProps) {
  const { shuttleTimetableDetail } = useShuttleTimetableDetail(routeId);
  const [selectedDetail, setSelectedDetail] = useState<string | null>('');

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
              <BusIcon />
              <div className={`${styles['bus-type']} ${styles[`type-${shuttleTimetableDetail.route_type}`]}`}>{shuttleTimetableDetail.route_type}</div>
            </div>
            <div className={styles.header__title}>
              {shuttleTimetableDetail.route_name}
              {' '}
              시간표
            </div>
            {shuttleTimetableDetail.sub_name && (
              <div className={styles['header__sub-title']}>
                {shuttleTimetableDetail.sub_name}
              </div>
            )}
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
          </div>

          <div className={`${styles['time-table']} ${styles['time-table--short']}`} style={{ gridTemplateRows: `repeat(${rowLength}, 1fr)` }}>
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
              <div
                className={styles['time-table__node']}
              >
                <div>{name}</div>
                {detail && <div className={styles['time-table__node-detail']}>{detail}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {shuttleTimetableDetail.route_info.length > 2 && (
        <div className={styles['time-table-wrapper']}>

          <div className={styles['time-table-title']}>
            <div className={styles['bus-icon']}>
              <BusIcon />
              <div className={`${styles['bus-type']} ${styles[`type-${shuttleTimetableDetail.route_type}`]}`}>{shuttleTimetableDetail.route_type}</div>
            </div>
            <div className={styles.header__title}>
              {shuttleTimetableDetail.route_name}
              {' '}
              시간표
            </div>
            {shuttleTimetableDetail.sub_name && (
              <div className={styles['header__sub-title']}>
                {shuttleTimetableDetail.sub_name}
              </div>
            )}
          </div>

          <div className={styles['time-table']} style={{ gridTemplateRows: `repeat(${rowLength}, 1fr)` }}>
            <div className={styles['time-table__number']}>승하차장명</div>
            {shuttleTimetableDetail.node_info.map(({ name, detail }) => (
              <div
                className={`${styles['time-table__node']} ${styles['time-table__node--long']}`}
              >
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

export default BusTimetableDetail;
