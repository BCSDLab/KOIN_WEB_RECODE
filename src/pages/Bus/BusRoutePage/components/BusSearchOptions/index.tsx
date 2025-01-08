import ChevronDown32 from 'assets/svg/Bus/chevron-down-32x32.svg';
import ChevronDown24 from 'assets/svg/Bus/chevron-down-24x24.svg';
import ChevronDown4b from 'assets/svg/Bus/chevron-down-4b.svg';
import { cn } from '@bcsdlab/utils';
import { BUS_TYPE_MAP } from 'pages/Bus/BusRoutePage/constants/busType';
import TimeDetail from 'pages/Bus/BusRoutePage/components/TimeDetail';
import { UseTimeSelectReturn } from 'pages/Bus/BusRoutePage/hooks/useTimeSelect';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { BusTypeRequest } from 'api/bus/entity';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { format12Hour, formatRelativeDate } from 'pages/Bus/BusRoutePage/utils/timeModule';
import { loggingBusTypeMap, useBusLogger } from 'pages/Bus/hooks/useBusLogger';
import styles from './BusSearchOptions.module.scss';

interface BusSearchOptionsProps {
  busType: BusTypeRequest;
  setBusType: (busType: BusTypeRequest) => void;
  timeSelect: UseTimeSelectReturn;
}

export default function BusSearchOptions({
  busType,
  setBusType,
  timeSelect,
}: BusSearchOptionsProps) {
  const isMobile = useMediaQuery();
  const { nowDate } = timeSelect.timeState;
  const [isTimeDetailOpen, , closeTimeDetail, toggleTimeDetail] = useBooleanState(false);
  const [isBusTypeOpen, , closeBusType, toggleBusType] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: closeBusType });
  const { logSearchResultDepartureTimeClick, logSearchResultBusType } = useBusLogger();

  const handleTimeDetailToggle = () => {
    toggleTimeDetail();
    logSearchResultDepartureTimeClick();
  };

  const handleBusTypeClick = (type: BusTypeRequest) => {
    setBusType(type);
    closeBusType();
    logSearchResultBusType(loggingBusTypeMap[type]);
  };

  useEscapeKeyDown({ onEscape: closeBusType });

  return (
    <div className={styles.box} ref={containerRef}>
      <div className={styles['time-bus']}>
        <button type="button" className={styles['depart-time']} onClick={handleTimeDetailToggle}>
          <span className={styles['depart-time__text']}>
            {`${formatRelativeDate(nowDate)} ${format12Hour(nowDate)}`}
          </span>
          <span className={styles['depart-time__description']}>출발</span>
          <span
            className={cn({
              [styles['depart-time__arrow']]: true,
              [styles['depart-time__arrow--open']]: isTimeDetailOpen,
            })}
          >
            {isMobile ? <ChevronDown24 /> : <ChevronDown32 />}
          </span>
        </button>
        <div className={styles['bus-type']}>
          <button type="button" className={styles['bus-type__button']} onClick={toggleBusType}>
            <span className={styles['bus-type__text']}>{BUS_TYPE_MAP[busType]}</span>
            <span
              className={cn({
                [styles['bus-type__arrow']]: true,
                [styles['bus-type__arrow--open']]: isBusTypeOpen,
              })}
            >
              {isMobile ? <ChevronDown24 /> : <ChevronDown4b />}
            </span>
          </button>
          {isBusTypeOpen && (
            <div className={styles['bus-type__dropdown']}>
              {(Object.entries(BUS_TYPE_MAP) as [BusTypeRequest, string][]).map(([type, name]) => (
                <button
                  key={type}
                  className={cn({
                    [styles['bus-type__option']]: true,
                    [styles['bus-type__option--selected']]: busType === type,
                  })}
                  onClick={() => handleBusTypeClick(type)}
                  type="button"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {isTimeDetailOpen && <TimeDetail timeSelect={timeSelect} close={closeTimeDetail} />}
    </div>
  );
}
