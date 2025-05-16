import { Link } from 'react-router-dom';
import ROUTES from 'static/routes';
import ChevronRight from 'assets/svg/IndexPage/Bus/chevron-right.svg';
import AddIcon from 'assets/svg/Club/add-icon.svg';
import ListIcon from 'assets/svg/Club/list-icon.svg';
import styles from './IndexClub.module.scss';

interface ClubLinkCardProps {
  id?: string;
  imgUrl?: string;
}

const ClubLinkCard = ({
  id = '1', // 임시 id 값
  imgUrl = 'https://placehold.co/60.jpg?text=Coming+soon...',
}: ClubLinkCardProps) => [
  {
    key: 'popularClubs',
    title: '인기 동아리',
    subtitle: '바로가기',
    link: ROUTES.ClubDetail({ id, isLink: true }),
    img: imgUrl,
  }, {
    key: 'clubList',
    title: '동아리 목록',
    subtitle: '바로가기',
    link: ROUTES.Club(),
    Icon: ListIcon,
  }, {
    key: 'addClub',
    title: '동아리 추가',
    subtitle: '추가하기',
    link: ROUTES.NewClub(),
    Icon: AddIcon,
  },
];

function IndexClub() {
  return (
    <section className={styles.template}>
      <div className={styles.template__title}>
        <Link
          to={ROUTES.Club()}
        >
          동아리
        </Link>
      </div>
      <div className={styles.cards}>
        {ClubLinkCard({}).map(({
          key, title, subtitle, link, Icon, img,
        }) => (
          <Link
            to={link}
            key={key}
            className={styles.card}
          >
            <div className={styles.card__segment}>
              {Icon ? <Icon /> : img && <img src={img} alt="" /> }
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
    </section>
  );
}

export default IndexClub;
