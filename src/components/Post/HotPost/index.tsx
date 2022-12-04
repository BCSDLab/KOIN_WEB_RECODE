import { useQuery } from 'react-query';
import LoadingSpinner from 'components/common/LoadingSpinner';
import * as api from 'api';
import styles from './HotPost.module.scss';

type HotPosts = {
  title: string
  id: number
  board_id: number
};

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

const useHotArticleList = () => {
  const { data: hotArticleList } = useQuery(
    'hotArticleList',
    api.notice.HotPostList,
    { retry: 0 },
  );

  if (hotArticleList instanceof Array) {
    return (
      <aside className={styles['hotPost-container']}>
        <div className={styles['hotPost-list']}>
          <div className={styles['hotPost-title']}>가장 많이 본 게시물</div>
          {
          hotArticleList.map((hotPost: HotPosts, index: number) => (
            <div className={styles['hotPost-content']} key={hotPost.id + hotPost.board_id}>
              <span className={styles['hotPost-rank']}>{ index + 1 }</span>
              <span className={styles['hotPost-item']}>{ hotPost.title }</span>
            </div>
          ))
          }
        </div>
        <div className={styles['link-list']}>
          {
            LINK_LIST.map((link) => (
              <button
                type="button"
                className={styles['link-button']}
                key={link.id}
                onClick={() => window.open(link.url)}
              >
                <img
                  className={styles['link-image']}
                  src={link.image}
                  alt="alineImg"
                />
              </button>
            ))
          }
        </div>
      </aside>
    );
  }

  return (
    <div className={styles['loading-container']}>
      <LoadingSpinner size="80px" />
    </div>
  );
};

export default useHotArticleList;
