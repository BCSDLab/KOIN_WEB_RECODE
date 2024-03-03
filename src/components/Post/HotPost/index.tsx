import { Link } from 'react-router-dom';
import { HotPostResponse } from 'api/notice/entity';
import { APIError } from 'interfaces/APIError';
import styles from './HotPost.module.scss';

interface HotPostProps {
  hotArticleList: HotPostResponse[] & APIError
}

const LINK_LIST = [
  {
    id: '0',
    title: ['코리아텍', '바로가기'],
    url: 'https://www.koreatech.ac.kr/kor.do',
    image: 'https://static.koreatech.in/assets/img/banner_koreatech.png',
  },
  {
    id: '1',
    title: ['아우누리', '바로가기'],
    url: 'https://portal.koreatech.ac.kr/login.jsp?sso=ok',
    image: 'https://static.koreatech.in/assets/img/banner_awoonori.png',
  },
  {
    id: '2',
    title: ['새로운 서비스', '요청하기'],
    url: 'https://docs.google.com/forms/d/1VEuxVK9ioVRZN36eb6m0UClyTJwW4lYiKLWcaQw2JzQ/edit',
    image: 'https://static.koreatech.in/assets/img/banner_add.png',
  },
  {
    id: '3',
    title: ['BCSDLab', '알아보기'],
    url: 'http://bcsdlab.com/',
    image: 'https://static.koreatech.in/assets/img/banner_bcsd.png',
  },
];

function HotPost(HotPostList: HotPostProps) {
  const { hotArticleList } = HotPostList;

  return (
    <aside className={styles.hotpost}>
      <div className={styles.hotpost__list}>
        <div className={styles.hotpost__title}>가장 많이 본 게시물</div>
        {
        hotArticleList.map((hotPost: HotPostResponse, index: number) => (
          <Link
            className={styles.hotpost__content}
            to={`/board/notice/${hotPost.id}`}
            key={hotPost.id + hotPost.board_id}
          >
            <span className={styles.hotpost__rank}>{ index + 1 }</span>
            <span className={styles.hotpost__item}>{ hotPost.title }</span>
          </Link>
        ))
        }
      </div>
      <div className={styles.link}>
        {
          LINK_LIST.map((link) => (
            <a
              className={styles.link__button}
              key={link.id}
              href={link.url}
            >
              <img
                className={styles.link__image}
                src={link.image}
                alt="alineImg"
              />
            </a>
          ))
        }
      </div>
    </aside>
  );
}

export default HotPost;
