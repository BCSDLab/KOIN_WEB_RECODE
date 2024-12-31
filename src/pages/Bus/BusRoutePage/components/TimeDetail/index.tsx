import { useTimeSelect } from 'pages/Bus/BusRoutePage/hooks/useTimeSelect';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import TimeDetailPC from 'pages/Bus/BusRoutePage/components/TimeDetail/TimeDetailPC';
import TimeDetailMobile from 'pages/Bus/BusRoutePage/components/TimeDetail/TimeDetailMobile';

interface TimeDetailProps {
  timeSelect: ReturnType<typeof useTimeSelect>;
  close: () => void;
}

export default function TimeDetail({ timeSelect, close }: TimeDetailProps) {
  const isMobile = useMediaQuery();

  return (
    <div>
      {isMobile ? (
        <TimeDetailMobile timeSelect={timeSelect} close={close} />
      ) : (
        <TimeDetailPC timeSelect={timeSelect} />
      )}
    </div>
  );
}
