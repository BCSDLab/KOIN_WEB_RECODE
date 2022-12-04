import { NoticeList } from 'api/notice/entity';
import styles from './PostList.module.scss';

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

function PostList(articleList: { articles: any | undefined; }) {
  return (
    articleList.articles?.map((article: NoticeList) => (
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
  );
}

export default PostList;
