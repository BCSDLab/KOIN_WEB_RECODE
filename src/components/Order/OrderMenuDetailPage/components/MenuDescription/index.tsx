import { cn } from '@bcsdlab/utils';

import styles from './MenuDescription.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/MenuDescription 이전. 이름·첫 번째 가격·설명(2줄 말줄임)
interface MenuDescriptionProps {
  name: string;
  description: string | null;
  price: number;
  noImage: boolean;
}

export default function MenuDescription({ name, description, price, noImage }: MenuDescriptionProps) {
  return (
    <div className={cn({ [styles.description]: true, [styles['description--no-image']]: noImage })}>
      <span className={styles.description__name}>{name}</span>
      <span className={styles.description__price}>
        {price.toLocaleString()}원
      </span>
      {description && <span className={styles.description__text}>{description}</span>}
    </div>
  );
}
