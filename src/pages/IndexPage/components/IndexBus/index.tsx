import { Link } from 'react-router-dom';
import { BUS_LINKS } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import ChevronRight from 'assets/svg/IndexPage/Bus/chevron-right.svg';
import styles from './IndexBus.module.scss';

function IndexBus() {
  const logger = useLogger();
  const logBus = () => logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_bus', value: '버스' });

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
      <div className={styles.cards}>
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
