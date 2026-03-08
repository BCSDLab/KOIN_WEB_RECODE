import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './TimeDropdown.module.scss';

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
      ref.current.scrollTop = clamped * ITEM_HEIGHT;
      isScrollingRef.current = false;
    }, 150);
  }, [items.length, onSelect]);

  return (
    <div ref={ref} className={styles['scroll-column']} onScroll={handleScroll}>
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
          onClick={() => {
            onSelect(i);
            ref.current?.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSelect(i);
              ref.current?.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' });
            }
          }}
        >
          {item}
        </div>
      ))}
      <div className={styles['scroll-column__padding']} />
    </div>
  );
}

// ─── 무한 스크롤 컬럼 (분 전용) ──────────────────────────────────────────────

const MINUTE_REPEAT = 5;

interface InfiniteScrollColumnProps {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

function InfiniteScrollColumn({ items, selectedIndex, onSelect }: InfiniteScrollColumnProps) {
  const count = items.length;
  const middleOffset = Math.floor(MINUTE_REPEAT / 2) * count;
  const ref = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTeleportingRef = useRef(false);
  const prevSelectedRef = useRef(selectedIndex);

  // 마운트 시 중간 복사본의 선택 위치로 즉시 이동 (애니메이션 없음)
  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTop = (middleOffset + selectedIndex) * ITEM_HEIGHT;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 외부에서 selectedIndex가 변경될 때 (초기화 등) 스크롤 위치 복원
  useEffect(() => {
    if (prevSelectedRef.current === selectedIndex) return;
    prevSelectedRef.current = selectedIndex;
    if (!ref.current) return;
    ref.current.scrollTop = (middleOffset + selectedIndex) * ITEM_HEIGHT;
  }, [selectedIndex, middleOffset]);

  const handleScroll = useCallback(() => {
    if (!ref.current || isTeleportingRef.current) return;

    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      if (!ref.current) return;

      let virtualIndex = Math.round(ref.current.scrollTop / ITEM_HEIGHT);

      // 상단 끝에 가까워지면 중간으로 순간이동
      if (virtualIndex < count) {
        isTeleportingRef.current = true;
        virtualIndex += middleOffset;
        ref.current.scrollTop = virtualIndex * ITEM_HEIGHT;
        isTeleportingRef.current = false;
      } else if (virtualIndex >= (MINUTE_REPEAT - 1) * count) {
        // 하단 끝에 가까워지면 중간으로 순간이동
        isTeleportingRef.current = true;
        virtualIndex -= middleOffset;
        ref.current.scrollTop = virtualIndex * ITEM_HEIGHT;
        isTeleportingRef.current = false;
      }

      // 가장 가까운 항목에 스냅
      ref.current.scrollTop = virtualIndex * ITEM_HEIGHT;

      const actualIndex = ((virtualIndex % count) + count) % count;
      onSelect(actualIndex);
    }, 150);
  }, [count, middleOffset, onSelect]);

  return (
    <div ref={ref} className={styles['infinite-scroll-column']} onScroll={handleScroll}>
      <div className={styles['scroll-column__padding']} />
      {Array.from({ length: MINUTE_REPEAT }, (_, repeatIdx) =>
        items.map((item, itemIdx) => (
          <div
            key={`${repeatIdx}-${itemIdx}`}
            role="button"
            tabIndex={0}
            className={cn({
              [styles['scroll-item']]: true,
              [styles['scroll-item--selected']]: itemIdx === selectedIndex,
            })}
            onClick={() => {
              if (!ref.current) return;
              const currentVirtual = Math.round(ref.current.scrollTop / ITEM_HEIGHT);
              const currentRepeat = Math.floor(currentVirtual / count);
              const targetVirtual = currentRepeat * count + itemIdx;
              onSelect(itemIdx);
              ref.current.scrollTo({ top: targetVirtual * ITEM_HEIGHT, behavior: 'smooth' });
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || !ref.current) return;
              const currentVirtual = Math.round(ref.current.scrollTop / ITEM_HEIGHT);
              const currentRepeat = Math.floor(currentVirtual / count);
              const targetVirtual = currentRepeat * count + itemIdx;
              onSelect(itemIdx);
              ref.current.scrollTo({ top: targetVirtual * ITEM_HEIGHT, behavior: 'smooth' });
            }}
          >
            {item}
          </div>
        )),
      )}
      <div className={styles['scroll-column__padding']} />
    </div>
  );
}

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const AMPM_ITEMS = ['AM', 'PM'];
const HOUR_ITEMS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTE_ITEMS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function formatTriggerTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// ─── TimeDropdown ─────────────────────────────────────────────────────────────

export interface TimeValue {
  hour: number;
  minute: number;
  isPM: boolean;
}

interface TimeDropdownProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
}

export default function TimeDropdown({ value, onChange }: TimeDropdownProps) {
  const [isOpen, , close, toggle] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: close });

  const [tempIsPM, setTempIsPM] = useState(value.isPM);
  const [tempHour, setTempHour] = useState(value.hour);
  const [tempMinute, setTempMinute] = useState(value.minute);

  const handleOpen = () => {
    setTempIsPM(value.isPM);
    setTempHour(value.hour);
    setTempMinute(value.minute);
    toggle();
  };

  const handleConfirm = () => {
    onChange({ hour: tempHour, minute: tempMinute, isPM: tempIsPM });
    close();
  };

  const handleReset = () => {
    setTempIsPM(value.isPM);
    setTempHour(value.hour);
    setTempMinute(value.minute);
  };

  const containerHeight = ITEM_HEIGHT * VISIBLE_COUNT;

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <button type="button" className={styles.trigger} onClick={handleOpen}>
        <span className={styles['trigger__ampm']}>{value.isPM ? '오후' : '오전'}</span>
        <div className={styles['trigger__divider']} />
        <span className={styles['trigger__time']}>{formatTriggerTime(value.hour, value.minute)}</span>
      </button>

      {isOpen && (
        <div
          className={styles.dropdown}
          style={{ '--container-height': `${containerHeight}px` } as React.CSSProperties}
        >
          <div className={styles.columns}>
            <ScrollColumn items={AMPM_ITEMS} selectedIndex={tempIsPM ? 1 : 0} onSelect={(i) => setTempIsPM(i === 1)} />
            <ScrollColumn items={HOUR_ITEMS} selectedIndex={tempHour - 1} onSelect={(i) => setTempHour(i + 1)} />
            <InfiniteScrollColumn items={MINUTE_ITEMS} selectedIndex={tempMinute} onSelect={(i) => setTempMinute(i)} />
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
