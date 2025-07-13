import {
  useState, useEffect, useRef, useMemo,
} from 'react';
import { cn } from '@bcsdlab/utils';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './TimePicker.module.scss';

interface TimePickerProps {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
  onClose: () => void;
}

const ITEM_HEIGHT = 36;

export default function TimePicker({
  onChange, onClose, hour, minute,
}: TimePickerProps) {
  const [tempHour, setTempHour] = useState(hour);
  const [tempMinute, setTempMinute] = useState(minute);

  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  useEscapeKeyDown({ onEscape: onClose });

  const baseHours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const baseMinutes = useMemo(
    () => Array.from({ length: 60 }, (_, i) => i).filter((m) => m % 5 === 0),
    [],
  );

  // 더미 데이터 추가 (50, 1, 0)
  const hours = useMemo(() => [50, 50, ...baseHours, 0, 0], [baseHours]);
  const minutes = useMemo(() => [1, 1, ...baseMinutes, 0, 0], [baseMinutes]);

  const hourRef = useRef<HTMLUListElement>(null);
  const minuteRef = useRef<HTMLUListElement>(null);

  const handleScroll = (
    ref: React.RefObject<HTMLUListElement>,
    setter: (v: number) => void,
    list: number[],
  ) => {
    if (!ref.current) return;
    const index = Math.round(ref.current.scrollTop / ITEM_HEIGHT) + 2;
    const clampedIndex = Math.max(0, Math.min(index, list.length - 1));
    setter(list[clampedIndex]);
  };

  const getScrollOffset = (index: number, listLength: number) => {
    if (index <= 1) return index * ITEM_HEIGHT;
    if (index >= listLength - 2) return (listLength - 5 + (index - (listLength - 3))) * ITEM_HEIGHT;
    return (index - 2) * ITEM_HEIGHT;
  };

  useEffect(() => {
    const h = hourRef.current;
    const m = minuteRef.current;

    if (!(h && m)) {
      return () => {};
    }

    let timeout: NodeJS.Timeout;

    const handleHourScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => handleScroll(hourRef, setTempHour, hours), 100);
    };

    const handleMinuteScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => handleScroll(minuteRef, setTempMinute, minutes), 100);
    };

    h.addEventListener('scroll', handleHourScroll);
    m.addEventListener('scroll', handleMinuteScroll);

    return () => {
      h.removeEventListener('scroll', handleHourScroll);
      m.removeEventListener('scroll', handleMinuteScroll);
    };
  }, [hours, minutes]);

  useEffect(() => {
    const hourIndex = hours.indexOf(tempHour);
    hourRef.current?.scrollTo({
      top: getScrollOffset(hourIndex, hours.length),
      behavior: 'smooth',
    });

    const minuteIndex = minutes.indexOf(tempMinute);
    minuteRef.current?.scrollTo({
      top: getScrollOffset(minuteIndex, minutes.length),
      behavior: 'smooth',
    });
  }, [tempHour, hours, tempMinute, minutes]);

  const getClass = (index: number, selectedValue: number, list: number[]) => {
    const selectedIndex = list.indexOf(selectedValue);
    const diff = Math.abs(index - selectedIndex);
    if (diff === 0) return styles.selected;
    if (diff === 1) return styles.near;
    if (diff === 2) return styles.far;
    return styles.hidden;
  };

  return (
    <div className={styles['modal-background']} ref={backgroundRef}>
      <div className={styles.modal}>
        <p className={styles.label}>시간을 선택해주세요.</p>
        <div className={styles.selector}>
          <ul className={styles.wheel} ref={hourRef}>
            {hours.map((h, idx) => (
              <li key={h}>
                <button
                  type="button"
                  className={cn({
                    [styles.item]: true,
                    [getClass(idx, tempHour, hours)]: true,
                  })}
                  onClick={() => {
                    setTempHour(h);
                    hourRef.current?.scrollTo({ top: (idx - 2) * ITEM_HEIGHT, behavior: 'smooth' });
                  }}
                >
                  {h}
                </button>
              </li>
            ))}
          </ul>
          <span className={styles.colon}>:</span>
          <ul className={styles.wheel} ref={minuteRef}>
            {minutes.map((m, idx) => (
              <li key={m}>
                <button
                  type="button"
                  className={cn({
                    [styles.item]: true,
                    [getClass(idx, tempMinute, minutes)]: true,
                  })}
                  onClick={() => {
                    setTempMinute(m);
                    minuteRef.current?.scrollTo({ top: (idx - 2) * ITEM_HEIGHT, behavior: 'smooth' });
                  }}
                >
                  {m.toString().padStart(2, '0')}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.buttons}>
          <button type="button" onClick={onClose}>취소</button>
          <button type="button" className={styles.confirm} onClick={() => { onChange(tempHour, tempMinute); onClose(); }}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
