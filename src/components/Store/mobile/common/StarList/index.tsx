import { useRef, type TouchEvent } from 'react';

import { cn } from '@bcsdlab/utils';
import StarIcon from 'assets/svg/Store/star-icon.svg';

import styles from './StarList.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/StarList 이전.
// onChange가 있으면 누르거나 끌어서 별점을 고르는 편집 모드, 없으면 비활성 버튼만 그리는 읽기 전용 모드다.
// 별 버튼은 KOIN_ORDER_WEBVIEW처럼 접근 가능한 이름 없이 순서대로 둔다
interface StarListProps {
  rating: number;
  size?: number;
  onChange?: (value: number) => void;
}

const STAR_VALUES = [1, 2, 3, 4, 5];

export default function StarList({ rating, size = 16, onChange }: StarListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateRatingByTouch = (e: TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !onChange) return;

    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
    const nextValue = Math.min(5, Math.max(1, Math.ceil(relativeX / size)));

    onChange(nextValue);
  };

  return (
    <div
      ref={containerRef}
      className={styles.stars}
      onTouchStart={onChange && updateRatingByTouch}
      onTouchMove={onChange && updateRatingByTouch}
    >
      {STAR_VALUES.map((value) => (
        <button
          key={value}
          type="button"
          disabled={!onChange}
          className={cn({ [styles.stars__button]: true, [styles['stars__button--editable']]: !!onChange })}
          onClick={onChange && (() => onChange(value))}
        >
          <StarIcon
            width={size}
            height={size}
            fill={value <= rating ? '#FFC62B' : '#D9D9D9'}
            className={styles.stars__icon}
          />
        </button>
      ))}
    </div>
  );
}
