import { useQuery } from 'react-query';
import PageNation from 'components/Post/PageNation';
import useParamsHandler from 'pages/Notice/hooks/useParamsHandler';
import * as api from 'api';
import cn from 'utils/ts/classnames';
import styles from './NoticePage.module.scss';

const useArticleList = () => {
  const { data: articleList } = useQuery(
    'articleList',
    api.notice.PostList,
    { retry: 0 },
  );
  return articleList;
};

const useHotArticleList = () => {
  const { data: hotArticleList } = useQuery(
    'hotArticleList',
    api.notice.HotPostList,
    { retry: 0 },
  );
  if (hotArticleList instanceof Array) {
    return hotArticleList;
  }
  return false;
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

const convertNoticeTag = (type: number) => {
  switch (type) {
    case 5:
      return '[일반공지]';
    case 6:
      return '[장학공지]';
    case 7:
      return '[학사공지]';
    case 8:
      return '[취업공지]';
    default:
      return '[코인공지]';
  }
};

const convertDate = (time: string) => {
  const times = time.split(' ');
  const date = times[0].split('-');
  const tim = times[1].split(':');
  const created = new Date();
  created.setFullYear(Number(date[0]));
  created.setMonth(Number(date[1]) - 1);
  created.setDate(Number(date[2]));
  created.setHours(Number(tim[0]));
  created.setMinutes(Number(tim[1]));
  created.setSeconds(Number(tim[2]));
  return created;
};

const setDate = (time: string) => {
  const today = new Date();
  const created = convertDate(time);
  const year = created.getFullYear();
  const month = created.getMonth() + 1 < 10 ? `0${created.getMonth() + 1}` : created.getMonth() + 1;
  const date = created.getDate() < 10 ? `0${created.getDate()}` : created.getDate();

  if (Math.floor((Number(today) - Number(created)) / 60 / 1000 / 60) < 4) {
    return [`${String(year)}.${String(month)}.${String(date)}`, true];
  }
  return [`${String(year)}.${String(month)}.${String(date)}`, false];
};

function NoticePage() {
  const articleList = useArticleList();
  const hotArticleList = useHotArticleList();
  const { searchParams } = useParamsHandler();
  console.log(articleList);
  console.log(hotArticleList);
  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.header__title}>공지사항</h1>
        </div>
        <div className={styles['post-section']}>
          <div className={styles['post-header']}>
            <div className={styles['post-row']}>
              <div className={cn({
                [styles['post-info']]: true,
                [styles['post-info--number']]: true,
              })}
              >
                번호
              </div>
              <div className={cn({
                [styles['post-info']]: true,
                [styles['post-info--title']]: true,
              })}
              >
                제목
              </div>
              <div className={cn({
                [styles['post-info']]: true,
                [styles['post-info--author']]: true,
              })}
              >
                작성자
              </div>
              <div className={cn({
                [styles['post-info']]: true,
                [styles['post-info--date']]: true,
              })}
              >
                날짜
              </div>
              <div className={cn({
                [styles['post-info']]: true,
                [styles['post-info--views']]: true,
              })}
              >
                조회수
              </div>
            </div>
          </div>
        </div>
        <div>
          {
            articleList?.articles.map((article) => (
              <div className={styles['post-content']} key={article.id}>
                <div className={styles['post-id']}>{ article.id }</div>
                <div className={styles['post-title']}>
                  <div className={styles['title-header']}>{ convertNoticeTag(article.board_id) }</div>
                  <div className={styles['title-content']}>{ article.title }</div>
                  { setDate(article.created_at)[1] && (
                    <img
                      className={styles['title-newTag']}
                      src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                      alt="new"
                    />
                  )}
                </div>
                <div className={styles['post-author']}>{ article.nickname }</div>
                <div className={styles['post-created_at']}>{ setDate(article.created_at)[0] }</div>
                <div className={styles['post-views']}>{ article.hit }</div>
              </div>
            ))
            }
        </div>
        <PageNation
          totalPageNum={articleList!.totalPage}
          nowPageNum={searchParams.get('boardId') === null ? 1 : Number(searchParams.get('boardId'))}
        />
      </div>
      <aside className={styles['hotPost-container']}>
        <div className={styles['hotPost-list']}>
          <div className={styles['hotPost-title']}>가장 많이 본 게시물</div>
          {
            hotArticleList && hotArticleList.map((hotPost: any, index: number) => (
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
    </div>
  );
}

export default NoticePage;
