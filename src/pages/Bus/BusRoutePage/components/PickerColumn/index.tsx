import { cn } from '@bcsdlab/utils';
import { useEffect, useRef } from 'react';
import styles from './PickerColumn.module.scss';

interface PickerColumnProps {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  flex: number;
}

export default function PickerColumn({
  items, selectedIndex, onChange, flex,
}: PickerColumnProps) {
  const itemHeight = 30;
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    const index = Math.round(scrollTop / itemHeight);
    if (index !== selectedIndex) {
      onChange(index);
    }
  };

  useEffect(() => {
    if (pickerRef.current) {
      pickerRef.current.scrollTop = selectedIndex * itemHeight;
    }
  }, [selectedIndex, itemHeight]);

  return (
    <div
      ref={pickerRef}
      className={styles.picker}
      style={{ flex: `${flex}` }}
      onScroll={handleScroll}
    >
      <div
        className={styles.items}
        style={{ height: `${(items.length - 1) * itemHeight}px` }}
      >
        {items.map((item, index) => (
          <div
            key={item}
            className={cn({
              [styles.items__item]: true,
              [styles['items__item--selected']]: index === selectedIndex,
            })}
            style={{ height: `${itemHeight}px` }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
