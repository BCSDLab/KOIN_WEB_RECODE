import { Link } from 'react-router-dom';
import ROUTES from 'static/routes';
import ChevronRight from 'assets/svg/IndexPage/Bus/chevron-right.svg';
import AddIcon from 'assets/svg/Club/add-icon.svg';
import ListIcon from 'assets/svg/Club/list-icon.svg';
import useHotClub from 'pages/Club/hooks/useHotClub';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './IndexClub.module.scss';

const ClubLinkCard = () => {
  const { data: hotClubInfo } = useHotClub();
  return [
    {
      key: 'popularClub',
      title: '인기 동아리',
      subtitle: '바로가기',
      link: ROUTES.ClubDetail({ id: hotClubInfo.club_id.toString(), isLink: true }),
      img: hotClubInfo.image_url || 'https://placehold.co/60.jpg?text=Coming+soon...',
    }, {
      key: 'clubList',
      title: '동아리 목록',
      subtitle: '바로가기',
      link: ROUTES.Club(),
      icon: <ListIcon />,
    }, {
      key: 'addClub',
      title: '동아리 추가',
      subtitle: '추가하기',
      link: ROUTES.NewClub(),
      icon: <AddIcon />,
    },
  ];
};

function IndexClub() {
  const logger = useLogger();
  const isMobile = useMediaQuery();
  const logClubList = () => logger.actionEventClick({
    team: 'CAMPUS',
    event_category: 'click',
    event_label: 'main_club',
    value: '',
  });

  return (
    <section className={styles.template}>
      <div className={styles.template__title}>
        <Link
          to={ROUTES.Club()}
        >
          동아리
        </Link>
      </div>
      {isMobile ? (
        <div className={styles.cards}>
          {ClubLinkCard().slice(0, 2).map(({
            key, title, subtitle, link, icon, img,
          }) => (
            <Link
              to={link}
              key={key}
              className={styles.card}
              onClick={key === 'clubList' ? logClubList : undefined}
            >
              <div className={styles.card__segment}>
                {icon ?? <img src={img} alt="title" /> }
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
      ) : (
        <div className={styles.cards}>
          {ClubLinkCard().map(({
            key, title, subtitle, link, icon, img,
          }) => (
            <Link
              to={link}
              key={key}
              className={styles.card}
              onClick={key === 'clubList' ? logClubList : undefined}
            >
              <div className={styles.card__segment}>
                {icon ?? <img src={img} alt="title" /> }
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

export default IndexClub;
