import StarIcon from 'assets/svg/Store/star-icon.svg';

import styles from './StarList.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/StarList(읽기 전용 모드) 이전
interface StarListProps {
  rating: number;
  size?: number;
}

const STAR_VALUES = [1, 2, 3, 4, 5];

export default function StarList({ rating, size = 16 }: StarListProps) {
  return (
    <div className={styles.stars}>
      {STAR_VALUES.map((value) => (
        <button key={value} type="button" disabled className={styles.stars__button}>
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
