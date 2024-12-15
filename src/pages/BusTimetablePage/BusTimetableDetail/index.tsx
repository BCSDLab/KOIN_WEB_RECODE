import useShuttleTimetableDetail from 'pages/BusTimetablePage/hooks/useShuttleTimetableDetail';
import { useEffect } from 'react';
import BusIcon from 'assets/svg/bus.svg';
import styles from './BusTimetableDetail.module.scss';
import { cn } from '@bcsdlab/utils';

interface ShuttleTimetableDetailProps {
  routeId : string;
}

function BusTimetableDetail({ routeId }: ShuttleTimetableDetailProps) {
  const { shuttleTimetableDetail } = useShuttleTimetableDetail(routeId);

  useEffect(() => {
    console.log(shuttleTimetableDetail);
  }, [shuttleTimetableDetail]);

  if (!shuttleTimetableDetail) return null;

  return (
    <>
      {shuttleTimetableDetail.route_info.length <= 2 && (
        <div>
          <div>등교, 하교</div>
          <div> </div>
          <div>
            {shuttleTimetableDetail.node_info.map(({ name, detail }) => (
              <div>
                {name}
                {' '}
                {detail}
              </div>
            ))}
          </div>
          <div>{shuttleTimetableDetail.region}</div>
          <div>{shuttleTimetableDetail.route_name}</div>
          <div>{shuttleTimetableDetail.route_type}</div>
          <div>
            {shuttleTimetableDetail.route_info.map(({ name, detail, arrival_time }) => (
              <div>
                {name}
                {' '}
                {detail}
                {' '}
                {arrival_time.map((time) => (
                  <span>
                    {time}
                    {' '}
                  </span>
                ))}
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
              <div className={styles['bus-type']}>{shuttleTimetableDetail.route_type}</div>
            </div>
            <div className={styles.header__title}>
              {shuttleTimetableDetail.route_name}
              {' '}
              시간표
            </div>
          </div>

          <div className={styles['time-table']} style={{ gridTemplateRows: `repeat(${shuttleTimetableDetail.node_info.length + 1}, 1fr)` }}>
            <div className={styles['time-table__number']}>승하차장명</div>
            {shuttleTimetableDetail.node_info.map(({ name, detail }) => (
              <div
                className={styles['time-table__node']}
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
