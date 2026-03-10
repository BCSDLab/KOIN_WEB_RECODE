import Link from 'next/link';
import ChevronRight from 'assets/svg/IndexPage/Bus/chevron-right.svg';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './IndexCallvan.module.scss';

const CALLVAN_LINKS = [
  {
    key: 'find',
    title: '콜밴팟 찾기',
    subtitle: '바로가기',
    link: ROUTES.Callvan(),
  },
  {
    key: 'create',
    title: '콜밴팟 모집',
    subtitle: '글 작성하기',
    link: ROUTES.CallvanAdd(),
  },
];

function IndexCallvan() {
  const logger = useLogger();

  return (
    <section className={styles.template}>
      <div className={styles.template__header}>
        <span className={styles.template__title}>콜밴팟 모집</span>
      </div>
      <div className={styles.cards}>
        {CALLVAN_LINKS.map(({ key, title, subtitle, link }) => (
          <Link
            href={link}
            key={key}
            className={styles.card}
            onClick={() => logger.actionEventClick({ team: 'CAMPUS', event_label: `main_callvan_${key}`, value: title })}
          >
            <div className={styles.card__guide}>
              <span className={styles.card__title}>{title}</span>
              <span className={styles.card__subtitle}>{subtitle}</span>
            </div>
            <ChevronRight />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default IndexCallvan;
