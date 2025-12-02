import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { articles } from 'api';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './HotArticles.module.scss';

const LINK_LIST = [
  {
    title: ['코리아텍', '바로가기'],
    url: 'https://www.koreatech.ac.kr/kor',
    image: 'https://static.koreatech.in/assets/img/banner_koreatech.png',
  },
  {
    title: ['아우누리', '바로가기'],
    url: 'https://portal.koreatech.ac.kr/login.jsp?sso=ok',
    image: 'https://static.koreatech.in/assets/img/banner_awoonori.png',
  },
  {
    title: ['새로운 서비스', '요청하기'],
    url: 'https://docs.google.com/forms/d/1VEuxVK9ioVRZN36eb6m0UClyTJwW4lYiKLWcaQw2JzQ/edit',
    image: 'https://static.koreatech.in/assets/img/banner_add.png',
  },
  {
    title: ['BCSDLab', '알아보기'],
    url: 'http://bcsdlab.com/',
    image: 'https://static.koreatech.in/assets/img/banner_bcsd.png',
  },
];

export default function HotArticles() {
  const logger = useLogger();
  const { data: hotArticles, isLoading } = useQuery({
    queryKey: ['hotArticles'],
    queryFn: articles.getHotArticles,
  });

  if (isLoading || !hotArticles) {
    return <LoadingSpinner size="80" />;
  }

  return (
    <aside className={styles['hot-article']}>
      <div className={styles['hot-article__list']}>
        <div className={styles['hot-article__title']}>가장 많이 본 게시물</div>
        {hotArticles.map((article, index) => (
          <Link
            className={styles['hot-article__content']}
            href={ROUTES.ArticlesDetail({ id: String(article.id), isLink: true })}
            key={article.id + article.board_id}
            onClick={() => logger.actionEventClick({ team: 'CAMPUS', event_label: 'notice_hot', value: article.title })}
          >
            <span className={styles['hot-article__rank']}>{index + 1}</span>
            <span className={styles['hot-article__item']}>{article.title}</span>
          </Link>
        ))}
      </div>
      <div className={styles.link}>
        {LINK_LIST.map((link) => (
          <a
            className={styles.link__button}
            key={link.url}
            href={link.url}
            onClick={() => {
              logger.actionEventClick({ team: 'CAMPUS', event_label: 'short_cut', value: link.title.join('_') });
            }}
          >
            <img className={styles.link__image} src={link.image} alt="alineImg" />
          </a>
        ))}
      </div>
    </aside>
  );
}
