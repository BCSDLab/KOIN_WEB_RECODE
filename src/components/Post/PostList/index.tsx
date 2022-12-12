import { NoticeList } from 'api/notice/entity';
import styles from './PostList.module.scss';

type ArticleList = {
  articles: NoticeList[] | undefined
};

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

const isCheckNewPost = (created: number[]) => {
  const today = new Date();
  console.log(today.getMonth());
  console.log(created[1] - today.getMonth());
  console.log(created[0] - today.getFullYear());
  if (created[0] - today.getFullYear() === 0 && (
    created[1] - today.getMonth() === 1) && (
    today.getDate() - created[2] <= 4)
  ) return true;
  return false;
};

const convertDate = (time: string) => time.split(' ')[0].replaceAll('-', '.');

const setDate = (time: string) => {
  const created = convertDate(time).split('.').map((item: string) => parseInt(item, 10));
  console.log(created);
  console.log(isCheckNewPost(created));
  if (isCheckNewPost(created)) {
    return [`${created}`, true];
  }
  return [`${created}`, false];
};

function PostList(props: ArticleList) {
  const { articles } = props;

  return (
    <div>
      {
        articles?.map((article: NoticeList) => (
          <div
            className={styles['post-content']}
            key={article.id}
          >
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
  );
}

export default PostList;
