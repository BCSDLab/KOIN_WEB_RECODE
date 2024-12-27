import { Arrival, BusTypeRequest, Depart } from 'api/bus/entity';
import BusRoute from 'pages/Bus/BusRoutePage/components/BusRoute';
import useBusRoute from 'pages/Bus/BusRoutePage/hooks/useBusRoute';
import { UseTimeSelectReturn } from 'pages/Bus/BusRoutePage/hooks/useTimeSelect';
import { formatDate } from 'pages/Bus/BusRoutePage/utils/timeModule';
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
    dayOfMonth: formattedValues.date,
    time: formattedValues.time,
    busType,
    depart,
    arrival,
  });

  if (!routeInfo) return null;

  const { departDate, departTime, schedule } = routeInfo;
  const today = new Date();
  const isToday = departDate === formatDate(today, today.getDate());

  return (
    <div className={styles.container}>
      {schedule.map((currentSchedule) => (
        <BusRoute
          key={currentSchedule.busName + currentSchedule.departTime}
          schedule={currentSchedule}
          isToday={isToday}
          selectedDepartTime={departTime}
        />
      ))}
    </div>
  );
}
