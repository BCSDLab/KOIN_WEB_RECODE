import Minus from 'assets/svg/Store/minus.svg';
import Plus from 'assets/svg/Store/plus.svg';

import styles from './MenuCounter.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/MenuCounter 이전. 수량은 1~10.
// 감소·증가 버튼은 order와 같게 접근성 이름·type 없이 둔다(상태 클릭 대상이 이름 없는 버튼 순서다)
interface MenuCounterProps {
  count: number;
  increaseCount: () => void;
  decreaseCount: () => void;
}

const MAX_COUNT = 10;

export default function MenuCounter({ count, increaseCount, decreaseCount }: MenuCounterProps) {
  const handleDecreaseCount = () => {
    if (count > 0) decreaseCount();
  };

  const handleIncreaseCount = () => {
    if (count < MAX_COUNT) increaseCount();
  };

  return (
    <div className={styles.counter}>
      <div className={styles.counter__box}>
        <button className={styles.counter__button} onClick={handleDecreaseCount}>
          <Minus />
        </button>
        <span className={styles.counter__count}>{count}</span>
        <button className={styles.counter__button} onClick={handleIncreaseCount}>
          <Plus />
        </button>
      </div>
    </div>
  );
}
