import { useState } from 'react';
import ChevronDown from 'assets/svg/Bus/chevron-down.svg';
import ChevronDown4b from 'assets/svg/Bus/chevron-down-4b.svg';
import { cn } from '@bcsdlab/utils';
import { BUS_TYPE_MAP, format12Hour } from 'pages/BusRoutePage/ts/busModules';
import TimeDetail from 'pages/BusRoutePage/components/TimeDetail';
import { UseTimeSelectReturn } from 'pages/BusRoutePage/hooks/useTimeSelect';
import { BusTypeRequest } from 'api/bus/entity';
import styles from './BusSearchOptions.module.scss';

interface BusSearchOptionsProps {
  busType: BusTypeRequest;
  setBusType: (busType: BusTypeRequest) => void;
  timeSelect: UseTimeSelectReturn;
}

export default function BusSearchOptions({
  busType, setBusType, timeSelect,
}: BusSearchOptionsProps) {
  const { hour, minute } = timeSelect.timeState;
  const [isTimeDetailOpen, setIsTimeDetailOpen] = useState(false);
  const [isBusTypeOpen, setIsBusTypeOpen] = useState(false);

  return (
    <div className={styles.box}>
      <div className={styles['time-bus']}>
        <button
          type="button"
          className={styles['depart-time']}
          onClick={() => setIsTimeDetailOpen(!isTimeDetailOpen)}
        >
          <span className={styles['depart-time__text']}>
            {format12Hour(hour, minute)}
          </span>
          <span className={styles['depart-time__description']}>출발</span>
          <span
            className={cn({
              [styles['depart-time__arrow']]: true,
              [styles['depart-time__arrow--open']]: isTimeDetailOpen,
            })}
          >
            <ChevronDown />
          </span>
        </button>
        <div className={styles['bus-type']}>
          <button
            type="button"
            className={styles['bus-type__button']}
            onClick={() => setIsBusTypeOpen(!isBusTypeOpen)}
          >
            <span className={styles['bus-type__text']}>
              {BUS_TYPE_MAP[busType]}
            </span>
            <span
              className={cn({
                [styles['bus-type__arrow']]: true,
                [styles['bus-type__arrow--open']]: isBusTypeOpen,
              })}
            >
              <ChevronDown4b />
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
                  onClick={() => {
                    setBusType(type);
                    setIsBusTypeOpen(false);
                  }}
                  type="button"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <TimeDetail
        isTimeDetailOpen={isTimeDetailOpen}
        timeSelect={timeSelect}
      />
    </div>
  );
}
