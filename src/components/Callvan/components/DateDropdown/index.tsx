import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import ChevronDownIcon from 'assets/svg/Callvan/chevron-down.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { formatKoreanDate } from 'utils/ts/calendar';
import styles from './DateDropdown.module.scss';

const ITEM_HEIGHT = 32;
const VISIBLE_COUNT = 3;

interface ScrollColumnProps {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

function ScrollColumn({ items, selectedIndex, onSelect }: ScrollColumnProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ref.current || isScrollingRef.current) return;
    ref.current.scrollTo({ top: selectedIndex * ITEM_HEIGHT, behavior: 'smooth' });
  }, [selectedIndex]);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    isScrollingRef.current = true;

    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      if (!ref.current) return;
      const index = Math.round(ref.current.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(items.length - 1, index));
      onSelect(clamped);
      ref.current.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' });
      isScrollingRef.current = false;
    }, 150);
  }, [items.length, onSelect]);

  const handleItemClick = (index: number) => {
    onSelect(index);
    ref.current?.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
  };

  return (
    <div
      ref={ref}
      className={styles['scroll-column']}
      onScroll={handleScroll}
    >
      <div className={styles['scroll-column__padding']} />
      {items.map((item, i) => (
        <div
          key={item}
          role="button"
          tabIndex={0}
          className={cn({
            [styles['scroll-item']]: true,
            [styles['scroll-item--selected']]: i === selectedIndex,
          })}
          onClick={() => handleItemClick(i)}
          onKeyDown={(e) => e.key === 'Enter' && handleItemClick(i)}
        >
          {item}
        </div>
      ))}
      <div className={styles['scroll-column__padding']} />
    </div>
  );
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function buildYears(): number[] {
  const today = new Date();
  const currentYear = today.getFullYear();
  return [currentYear, currentYear + 1];
}

interface DateDropdownProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export default function DateDropdown({ selectedDate, onChange }: DateDropdownProps) {
  const [isOpen, , close, toggle] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: close });

  const years = buildYears();

  const [tempYear, setTempYear] = useState(selectedDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(selectedDate.getMonth());
  const [tempDay, setTempDay] = useState(selectedDate.getDate());

  const daysInMonth = getDaysInMonth(tempYear, tempMonth);
  const clampedDay = Math.min(tempDay, daysInMonth);

  const yearItems = years.map((y) => `${y}년`);
  const monthItems = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
  const dayItems = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}일`);

  const yearIndex = years.indexOf(tempYear);
  const monthIndex = tempMonth;
  const dayIndex = clampedDay - 1;

  const handleConfirm = () => {
    onChange(new Date(tempYear, tempMonth, clampedDay));
    close();
  };

  const handleReset = () => {
    const today = selectedDate;
    setTempYear(today.getFullYear());
    setTempMonth(today.getMonth());
    setTempDay(today.getDate());
  };

  const handleOpen = () => {
    setTempYear(selectedDate.getFullYear());
    setTempMonth(selectedDate.getMonth());
    setTempDay(selectedDate.getDate());
    toggle();
  };

  const containerHeight = ITEM_HEIGHT * VISIBLE_COUNT;

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <button type="button" className={styles.trigger} onClick={handleOpen}>
        <span>{formatKoreanDate(selectedDate)}</span>
        <ChevronDownIcon className={cn({ [styles['trigger__icon--open']]: isOpen })} />
      </button>

      {isOpen && (
        <div className={styles.dropdown} style={{ '--container-height': `${containerHeight}px` } as React.CSSProperties}>
          <div className={styles.columns}>
            <ScrollColumn
              items={yearItems}
              selectedIndex={Math.max(0, yearIndex)}
              onSelect={(i) => setTempYear(years[i])}
            />
            <ScrollColumn
              items={monthItems}
              selectedIndex={monthIndex}
              onSelect={(i) => setTempMonth(i)}
            />
            <ScrollColumn
              items={dayItems}
              selectedIndex={dayIndex}
              onSelect={(i) => setTempDay(i + 1)}
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.actions}>
            <button type="button" className={styles['actions__btn']} onClick={handleReset}>
              초기화
            </button>
            <button type="button" className={styles['actions__btn']} onClick={handleConfirm}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
