import { Link } from 'react-router-dom';
import { BUS_LINKS } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useCallback, useEffect, useState } from 'react';
import ROUTES from 'static/routes';
import ChevronRight from 'assets/svg/IndexPage/Bus/chevron-right.svg';
import useMobileBusCarousel from './hooks/useMobileBusCarousel';
import styles from './IndexBus.module.scss';

function IndexBus() {
  const {
    sliderRef, mobileBusTypes, matchToMobileType,
  } = useMobileBusCarousel();
  const logger = useLogger();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);

  const logBus = () => logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_bus', value: '버스' });

  const handleScroll = useCallback(() => {
    if (sliderRef.current) {
      const index = Math.round(
        sliderRef.current.scrollLeft / (sliderRef.current.scrollWidth / mobileBusTypes.length),
      );

      if (index !== currentSlideIndex) {
        const fromCard = BUS_TYPES[mobileBusTypes[currentSlideIndex]].tabName;
        const toCard = BUS_TYPES[mobileBusTypes[index]].tabName;

        logger.actionEventClick({
          actionTitle: 'CAMPUS',
          title: 'main_bus_scroll',
          value: `${fromCard}>${toCard}`,
        });

        setCurrentSlideIndex(index);
      }
    }
  }, [sliderRef, mobileBusTypes, currentSlideIndex, logger]);

  useEffect(() => {
    const sliderElement = sliderRef.current;

    if (sliderElement) {
      sliderElement.addEventListener('scroll', handleScroll);
      return () => {
        sliderElement.removeEventListener('scroll', handleScroll);
      };
    }
    return undefined;
  }, [handleScroll, sliderRef]);

  return (
    <section className={styles.template}>
      <div className={styles.template__title}>
        <Link
          to={ROUTES.BusRoute()}
          onClick={logBus}
        >
          버스
        </Link>
      </div>
      <div className={styles.cards} ref={sliderRef}>
        {BUS_LINKS.map(({
          key, title, subtitle, link, SvgIcon,
        }) => (
          <Link
            to={link}
            key={key}
            className={styles.cards__card}
            onClick={logBus}
          >
            <div className={styles['cards__card-segment']}>
              <SvgIcon />
              <div className={styles['cards__card-guide']}>
                <span className={styles['cards__card-title']}>
                  {title}
                </span>
                <span className={styles['cards__card-subtitle']}>
                  {subtitle}
                </span>
              </div>
            </div>
            <ChevronRight />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default IndexBus;
