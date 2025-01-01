import { Link } from 'react-router-dom';
import { BUS_LINKS } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import ChevronRight from 'assets/svg/IndexPage/Bus/chevron-right.svg';
import QRCode from 'assets/svg/IndexPage/Bus/qr-code.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './IndexBus.module.scss';

function IndexBus() {
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const logBus = () => logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_bus', value: '버스' });

  const unibus = BUS_LINKS[2];

  return (
    <section className={styles.template}>
      <div className={styles.template__title}>
        <Link
          to={ROUTES.BusRoute()}
          onClick={logBus}
        >
          버스
        </Link>
        {isMobile && (
          <Link
            to={unibus.link}
            className={styles.unibus}
          >
            <QRCode />
            <span className={styles.unibus__title}>셔틀 탑승권</span>
          </Link>
        )}
      </div>
      {isMobile ? (
        <div className={styles.cards}>
          {BUS_LINKS.slice(0, 2).map(({
            key, title, subtitle, link,
          }) => (
            <Link
              to={link}
              key={key}
              className={styles.card}
              onClick={logBus}
            >
              <div className={styles.card__guide}>
                <span className={styles.card__title}>
                  {title}
                </span>
                <span className={styles.card__subtitle}>
                  {subtitle}
                </span>
              </div>
              <ChevronRight />
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.cards}>
          {BUS_LINKS.map(({
            key, title, subtitle, link, SvgIcon,
          }) => (
            <Link
              to={link}
              key={key}
              className={styles.card}
              onClick={logBus}
            >
              <div className={styles.card__segment}>
                <SvgIcon />
                <div className={styles.card__guide}>
                  <span className={styles.card__title}>
                    {title}
                  </span>
                  <span className={styles.card__subtitle}>
                    {subtitle}
                  </span>
                </div>
              </div>
              <ChevronRight />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default IndexBus;
