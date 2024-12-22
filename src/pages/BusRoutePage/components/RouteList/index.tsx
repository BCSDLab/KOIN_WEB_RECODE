import { Arrival, BusTypeRequest, Depart } from 'api/bus/entity';
import BusRoute from 'pages/BusRoutePage/components/BusRoute';
import useBusRoute from 'pages/BusRoutePage/hooks/useBusRoute';
import { UseTimeSelectReturn } from 'pages/BusRoutePage/hooks/useTimeSelect';
import styles from './RouteList.module.scss';

interface RouteListProps {
  timeSelect: UseTimeSelectReturn;
  busType: BusTypeRequest;
  depart: Depart;
  arrival: Arrival;
}

export default function RouteList({
  timeSelect, busType, depart, arrival,
}: RouteListProps) {
  const { formattedValues } = timeSelect;
  const { data: routeInfo } = useBusRoute({
    date: formattedValues.date,
    time: formattedValues.time,
    busType,
    depart,
    arrival,
  });

  if (!routeInfo) return null;

  const { schedule } = routeInfo;

  return (
    <div className={styles.container}>
      {schedule.map(({ busType: currentBusType, busName, departTime }) => (
        <BusRoute
          key={busName + departTime}
          busType={currentBusType}
          busName={busName}
          departTime={departTime}
        />
      ))}
    </div>
  );
}
