import { Arrival, BusTypeRequest, Depart } from 'api/bus/entity';
import BusRoute from 'pages/Bus/BusRoutePage/components/BusRoute';
import useBusRoute from 'pages/Bus/BusRoutePage/hooks/useBusRoute';
import { UseTimeSelectReturn } from 'pages/Bus/BusRoutePage/hooks/useTimeSelect';
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
  const { data } = useBusRoute({
    dayOfMonth: formattedValues.date,
    time: formattedValues.time,
    busType,
    depart,
    arrival,
  });

  if (!data) return null;

  const { schedule } = data;

  return (
    <div className={styles.container}>
      {schedule.map((currentSchedule) => (
        <BusRoute
          key={currentSchedule.busName + currentSchedule.departTime}
          schedule={currentSchedule}
        />
      ))}
    </div>
  );
}
