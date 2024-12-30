import { useTimeSelect } from 'pages/Bus/BusRoutePage/hooks/useTimeSelect';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import TimeDetailPC from 'pages/BusRoutePage/components/TimeDetail/TimeDetailPC';
import styles from './TimeDetail.module.scss';

interface TimeDetailProps {
  timeSelect: ReturnType<typeof useTimeSelect>;
}

export default function TimeDetail({ timeSelect }: TimeDetailProps) {
  const isMobile = useMediaQuery();

  return (
    <div>
      {isMobile ? (
        <TimeDetailPC timeSelect={timeSelect} />
      ) : (
        <TimeDetailPC timeSelect={timeSelect} />
      )}
    </div>
  );
}
