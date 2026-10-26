import { cn } from '@bcsdlab/utils';
import type { ShuttleTimetableDetailInfoResponse } from 'api/bus/entity';
import InformationIcon from 'assets/svg/Bus/info-gray.svg';
import { BUS_FEEDBACK_FORM, SHUTTLE_ROUTE_TYPE_CLASS } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';

import styles from './ShuttleDetailMobile.module.scss';

interface ShuttleDetailMobileProps {
  timetable: ShuttleTimetableDetailInfoResponse;
  selectedName: string;
  onSelect: (name: string) => void;
}

export default function ShuttleDetailMobile({ timetable, selectedName, onSelect }: ShuttleDetailMobileProps) {
  const logger = useLogger();
  const isMultiple = timetable.route_info.length > 2;
  const showDirections = !isMultiple && timetable.route_info.length > 1;
  const selectedRoute = timetable.route_info.find(({ name }) => name === selectedName);
  const routeTypeClass = styles[SHUTTLE_ROUTE_TYPE_CLASS[timetable.route_type]];

  return (
    <main className={styles.detail}>
      <div
        className={cn({
          [styles.detail__heading]: true,
          [styles['detail__heading--divided']]: !showDirections,
        })}
      >
        <span className={`${styles['bus-type']} ${routeTypeClass ?? ''}`}>{timetable.route_type}</span>
        <h2 className={styles.detail__title}>{timetable.route_name} 시간표</h2>
        {timetable.sub_name && <p className={styles.detail__subtitle}>{timetable.sub_name}</p>}
      </div>

      {showDirections && (
        <div className={styles.detail__directions}>
          {timetable.route_info.map(({ name }) => (
            <button
              key={name}
              type="button"
              className={cn({
                [styles.detail__direction]: true,
                [styles['detail__direction--selected']]: selectedName === name,
              })}
              aria-pressed={selectedName === name}
              onClick={() => onSelect(name)}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <div className={styles['detail__table-wrapper']}>
        <table
          className={cn({
            [styles.timetable]: true,
            [styles['timetable--multiple']]: isMultiple,
          })}
          aria-label={`${timetable.route_name} 시간표`}
        >
          <thead>
            <tr>
              {isMultiple ? (
                <>
                  <th scope="col">승하차장명</th>
                  {timetable.route_info.map(({ name, detail }) => (
                    <th key={name} scope="col">
                      {name}
                      {detail && <span className={styles.timetable__description}>{detail}</span>}
                    </th>
                  ))}
                </>
              ) : (
                <>
                  <th scope="col">
                    {selectedRoute?.name}
                    {selectedRoute?.detail && (
                      <span className={styles.timetable__description}>{selectedRoute.detail}</span>
                    )}
                  </th>
                  <th scope="col">승하차장명</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {timetable.node_info.map((node, nodeIndex) => (
              <tr key={node.name}>
                {isMultiple ? (
                  <>
                    <th scope="row" className={styles.timetable__stop}>
                      {node.name}
                      {node.detail && <span className={styles.timetable__description}>{node.detail}</span>}
                    </th>
                    {timetable.route_info.map((route) => (
                      <td key={route.name} className={styles.timetable__time}>
                        {route.arrival_time[nodeIndex]?.split('/')[0]}
                      </td>
                    ))}
                  </>
                ) : (
                  <>
                    <td className={styles.timetable__time}>{selectedRoute?.arrival_time[nodeIndex]?.split('/')[0]}</td>
                    <th scope="row" className={styles.timetable__stop}>
                      {node.name}
                      {node.detail && ` ${node.detail}`}
                    </th>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <a
        className={styles.detail__feedback}
        href={BUS_FEEDBACK_FORM}
        target="_blank"
        rel="noreferrer"
        onClick={() => {
          logger.actionEventClick({
            team: 'CAMPUS',
            event_label: 'error_feedback_button',
            value: `셔틀_${timetable.route_type}_${timetable.route_name}`,
          });
        }}
      >
        <InformationIcon aria-hidden="true" />
        정보가 정확하지 않나요?
      </a>
    </main>
  );
}
