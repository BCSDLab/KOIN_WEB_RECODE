import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';
import { storeQueries } from 'api/store/queries';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import ForkKnifeIcon from 'assets/svg/common/fork-knife-icon.svg';
import IconBox from 'components/ui/IconBox';

import styles from './StoreCard.module.scss';

interface StoreCardProps {
  href: string;
  onClick: () => void;
}

export default function StoreCard({ href, onClick }: StoreCardProps) {
  const { data: storeCounts } = useSuspenseQuery(storeQueries.counts());
  const { data: storeEventCount } = useSuspenseQuery(storeQueries.eventCount());

  return (
    <Link href={href} className={styles['store-card']} onClick={onClick}>
      <div className={styles['store-card__content-wrapper']}>
        <IconBox className={styles['store-card__icon']}>
          <ForkKnifeIcon aria-hidden />
        </IconBox>
        <span className={styles['store-card__content']}>
          <span className={styles['store-card__badge']}>KOIN 전용 이벤트 {storeEventCount.count}곳</span>
          <span className={styles['store-card__title']}>
            많이 찾는 상점
            <br />
            둘러보기
          </span>
          <span className={styles['store-card__meta']}>
            영업중 <span className={styles['store-card__count']}>{storeCounts.open_count}곳</span> | 전체{' '}
            {storeCounts.total_count}곳
          </span>
        </span>
      </div>
      <span className={styles['store-card__arrow']}>
        <ArrowRightIcon aria-hidden />
      </span>
    </Link>
  );
}
