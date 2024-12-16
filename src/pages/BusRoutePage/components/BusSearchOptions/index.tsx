import { useState } from 'react';
import ChevronLeft from 'assets/svg/Bus/chevron-left.svg';
import ChevronRight from 'assets/svg/Bus/chevron-right.svg';
import ChevronDown from 'assets/svg/Bus/chevron-down.svg';
import ChevronDown4b from 'assets/svg/Bus/chevron-down-4b.svg';
import { cn } from '@bcsdlab/utils';
import { BusType, BUS_TYPE_MAP, format12Hour } from 'pages/BusRoutePage/ts/busModules';
import styles from './BusSearchOptions.module.scss';

export default function BusSearchOptions() {
  const now = new Date();
  const initialTime = {
    hour: now.getHours(),
    minute: Math.floor(now.getMinutes() / 10) * 10,
  };

  const [isTimeDetailOpen, setIsTimeDetailOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [selectedBusType, setSelectedBusType] = useState<BusType>('shuttle');
  const [isBusTypeOpen, setIsBusTypeOpen] = useState(false);

  // const hours = Array.from({ length: 19 }, (_, i) => i + 6); // 6시부터 24시까지

  return (
    <div className={styles.box}>
      <div className={styles['time-type']}>
        <button
          type="button"
          className={styles['depart-time']}
          onClick={() => setIsTimeDetailOpen(!isTimeDetailOpen)}
        >
          <span className={styles['depart-time__text']}>
            {format12Hour(selectedTime.hour, selectedTime.minute)}
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
              {BUS_TYPE_MAP[selectedBusType]}
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
              {(Object.entries(BUS_TYPE_MAP) as [BusType, string][]).map(([type, name]) => (
                <button
                  key={type}
                  className={cn({
                    [styles['bus-type__option']]: true,
                    [styles['bus-type__option--selected']]: selectedBusType === type,
                  })}
                  onClick={() => {
                    setSelectedBusType(type);
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
      {isTimeDetailOpen && (
        <div className={styles['depart-time-detail']}>
          <div className={styles.header}>
            <span className={styles.title}>출발 시각 설정</span>
            <span className={styles.description}>
              현재는 정규학기(12월 20일까지)의 시간표를 제공하고 있어요.
            </span>
          </div>
          <div className={styles.selector}>
            <button
              className={styles['time-nav']}
              onClick={() => {
                if (selectedTime.hour > 6) {
                  setSelectedTime((prev) => ({ ...prev, hour: prev.hour - 1 }));
                }
              }}
              type="button"
              aria-label="이전 시간"
            >
              <ChevronLeft />
            </button>
            <div className={styles['time-display']}>
              {`${selectedTime.hour}시`}
            </div>
            <button
              className={styles['time-nav']}
              onClick={() => {
                if (selectedTime.hour < 24) {
                  setSelectedTime((prev) => ({ ...prev, hour: prev.hour + 1 }));
                }
              }}
              type="button"
              aria-label="다음 시간"
            >
              <ChevronRight />
            </button>
          </div>
          <button
            className={styles['apply-button']}
            onClick={() => setIsTimeDetailOpen(false)}
            type="button"
          >
            지금 출발
          </button>
        </div>
      )}
    </div>
  );
}
