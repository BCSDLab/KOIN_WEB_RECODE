import type { MenuPrice } from 'api/order/entity';
import RadioFalse from 'assets/svg/Store/radio-false.svg';
import RadioTrue from 'assets/svg/Store/radio-true.svg';

import styles from './MenuPriceSelects.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/MenuPriceSelects 이전. 가격이 둘 이상일 때 단일 선택(라디오)으로 고른다
interface MenuPriceSelectsProps {
  prices: MenuPrice[];
  selectedPriceId: number;
  selectPrice: (priceId: number) => void;
}

export default function MenuPriceSelects({ prices, selectedPriceId, selectPrice }: MenuPriceSelectsProps) {
  if (prices.length <= 1) return null;

  return (
    <div className={styles.prices}>
      <div className={styles.prices__header}>
        <div>
          <span className={styles.prices__label}>가격</span>
        </div>
        <span className={styles.prices__required}>필수</span>
      </div>
      <div className={styles.prices__list}>
        {prices.map((price) => {
          const checked = selectedPriceId === price.id;

          return (
            <button
              key={price.id}
              type="button"
              className={styles.prices__item}
              onClick={() => selectPrice(price.id)}
              role="radio"
              aria-checked={checked}
            >
              {checked ? <RadioTrue /> : <RadioFalse />}
              <span className={styles.prices__name}>{price.name}</span>
              <span className={styles.prices__price}>
                {price.price.toLocaleString()}원
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
