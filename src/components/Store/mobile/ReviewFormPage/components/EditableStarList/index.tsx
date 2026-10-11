import { useRef } from 'react';
import type { TouchEvent } from 'react';

import StarIcon from 'assets/svg/store/star-icon.svg';

import styles from './EditableStarList.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/StarList(editable 모드) 이전.
// 별 버튼은 오라클처럼 접근 가능한 이름 없이 순서대로 둔다(누르거나 끌어서 별점을 고른다)
interface EditableStarListProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

const STAR_VALUES = [1, 2, 3, 4, 5];

export default function EditableStarList({ value, onChange, size = 40 }: EditableStarListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateRatingByTouch = (e: TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
    const nextValue = Math.min(5, Math.max(1, Math.ceil(relativeX / size)));

    onChange(nextValue);
  };

  return (
    <div
      ref={containerRef}
      className={styles.stars}
      onTouchStart={updateRatingByTouch}
      onTouchMove={updateRatingByTouch}
    >
      {STAR_VALUES.map((starValue) => (
        <button key={starValue} type="button" className={styles.stars__button} onClick={() => onChange(starValue)}>
          <StarIcon
            width={size}
            height={size}
            fill={starValue <= value ? '#FFC62B' : '#D9D9D9'}
            className={styles.stars__icon}
          />
        </button>
      ))}
    </div>
  );
}
