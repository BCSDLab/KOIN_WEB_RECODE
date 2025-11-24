import Link from 'next/link';
import { HotClubResponse } from 'api/club/entity';
import AddIcon from 'assets/svg/Club/add-icon.svg';
import ListIcon from 'assets/svg/Club/list-icon.svg';
import ChevronRight from 'assets/svg/IndexPage/Bus/chevron-right.svg';
import useHotClub from 'components/Club/hooks/useHotClub';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import ROUTES from 'static/routes';
import { useABTestView } from 'utils/hooks/abTest/useABTestView';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import ClubMobileViewB from './ClubMobileViewB';
import styles from './IndexClub.module.scss';

const getClubLinkCardData = (hotClubInfo: HotClubResponse) => [
  {
    key: 'popularClub',
    title: '인기 동아리',
    subtitle: '바로가기',
    link:
      hotClubInfo.club_id !== -1
        ? ROUTES.ClubDetail({ id: hotClubInfo.club_id.toString(), isLink: true, hot: 'true' })
        : ROUTES.Club(),
    img: hotClubInfo?.image_url || 'https://placehold.co/60.jpg?text=Coming+soon...',
  },
  {
    key: 'clubList',
    title: '동아리 목록',
    subtitle: '바로가기',
    link: ROUTES.Club(),
    icon: <ListIcon />,
  },
  {
    key: 'addClub',
    title: '동아리 추가',
    subtitle: '추가하기',
    link: ROUTES.NewClub(),
    icon: <AddIcon />,
  },
];

function IndexClub() {
  const { data: hotClubInfo } = useHotClub();
  const clubLinkCardData = getClubLinkCardData(hotClubInfo);
  const token = useTokenState();
  const ABView = useABTestView('a_main_club_ui', token);
  const logger = useLogger();
  const isMobile = useMediaQuery();
  const [isAuthModalOpen, openAuthModal, closeAuthModal] = useBooleanState(false);

  const handleClickLog = (key: string) => {
    if (key === 'clubList') {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'main_club',
        value: '',
      });
    } else if (key === 'popularClub') {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'main_popular_club',
        value: '인기 동아리',
      });
    } else {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'main_club_add',
        value: '동아리 추가',
      });
    }
  };
  return (
    <section className={styles.template}>
      <Link className={styles.template__title} href={ROUTES.Club()}>
        동아리
      </Link>
      {}
      {isMobile ? (
        ABView === 'hot' ? (
          <div className={styles.cards}>
            {clubLinkCardData.slice(0, 2).map(({ key, title, subtitle, link, icon, img }) => (
              <Link href={link} key={key} className={styles.card} onClick={() => handleClickLog(key)}>
                <div className={styles.card__segment}>
                  {icon ?? <img src={img} alt="title" />}
                  <div className={styles.card__guide}>
                    <span className={styles.card__title}>{title}</span>
                    <span className={styles.card__subtitle}>{subtitle}</span>
                  </div>
                </div>
                <ChevronRight />
              </Link>
            ))}
          </div>
        ) : (
          <ClubMobileViewB />
        )
      ) : (
        <div className={styles.cards}>
          {clubLinkCardData.map(({ key, title, subtitle, link, icon, img }) => (
            <Link
              href={link}
              key={key}
              className={styles.card}
              onClick={(e) => {
                if (!token && key === 'addClub') {
                  e.preventDefault();
                  openAuthModal();
                } else {
                  handleClickLog(key);
                }
              }}
            >
              <div className={styles.card__segment}>
                {icon ?? <img src={img} alt="title" />}
                <div className={styles.card__guide}>
                  <span className={styles.card__title}>{title}</span>
                  <span className={styles.card__subtitle}>{subtitle}</span>
                </div>
              </div>
              <ChevronRight />
            </Link>
          ))}
        </div>
      )}
      {isAuthModalOpen && (
        <LoginRequiredModal title="동아리를 생성하기" description="로그인 후 이용해주세요." onClose={closeAuthModal} />
      )}
    </section>
  );
}

export default IndexClub;
