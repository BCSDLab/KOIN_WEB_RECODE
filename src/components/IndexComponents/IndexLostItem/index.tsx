import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ChevronRightIcon from 'assets/svg/IndexPage/Bus/chevron-right.svg';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useLostItemStat from './hooks/useLostItemStat';
import styles from './IndexLostItem.module.scss';

const SLIDE_INTERVAL = 5000;
const MIN_FOUND_COUNT = 50;

function IndexLostItem() {
  const isMobile = useMediaQuery();
  const { lostItemStat } = useLostItemStat();
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardMessages = useMemo(() => {
    const messages = [];

    if (lostItemStat.found_count >= MIN_FOUND_COUNT) {
      messages.push({
        prefix: '지금까지 ',
        highlight: `${lostItemStat.found_count}명`,
        suffix: '이 분실물을 찾았어요.',
      });
    }

    messages.push({
      prefix: '',
      highlight: `${lostItemStat.not_found_count}개`,
      suffix: '의 분실물이 주인을 찾고 있어요.',
    });

    return messages;
  }, [lostItemStat.found_count, lostItemStat.not_found_count]);

  const shouldAnimate = cardMessages.length > 1;

  useEffect(() => {
    if (!shouldAnimate) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cardMessages.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [cardMessages.length, shouldAnimate]);

  return (
    <section className={styles.template}>
      <div className={styles.template__header}>
        <Link href={ROUTES.LostItemRedirect()} className={styles.template__title}>
          분실물
        </Link>
        {isMobile && <ChevronRightIcon />}
      </div>
      <Link href={ROUTES.LostItemRedirect()} className={styles.card}>
        <div className={styles.card__info}>
          {shouldAnimate ? (
            <div className={styles['card__info-slider']}>
              {cardMessages.map((message) => (
                <div key={`placeholder-${message.suffix}`} className={styles['card__info-placeholder']}>
                  {message.prefix}
                  <span>{message.highlight}</span>
                  {message.suffix}
                </div>
              ))}
              {cardMessages.map((message, index) => (
                <div
                  key={`${message.highlight}-${message.suffix}`}
                  className={`${styles['card__info-item']} ${index === currentIndex ? styles['card__info-item--active'] : ''}`}
                >
                  {message.prefix}
                  <span>{message.highlight}</span>
                  {message.suffix}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles['card__info-static']}>
              {cardMessages[0].prefix}
              <span>{cardMessages[0].highlight}</span>
              {cardMessages[0].suffix}
            </div>
          )}
        </div>
        {!isMobile && <ChevronRightIcon />}
      </Link>
    </section>
  );
}

export default IndexLostItem;
