import Image from 'next/image';
import ViewIcon from 'assets/svg/Login/eye-open.svg';
import { convertArticlesTag } from 'components/Articles/utils/convertArticlesTag';
import styles from './ArticleHeader.module.scss';

interface ArticleHeaderProps {
  boardId: number;
  title: string;
  registeredAt: string;
  author: string;
  hit: number;
  isNew: boolean;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const formatMobileDate = (time: string) => {
  const [date] = time.split(' ');
  const [year, month, day] = date.split('-').map(Number);

  if (!year || !month || !day) return date.replaceAll('-', '.');

  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return `${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} ${weekday}`;
};

const formatViewCount = (hit: number) => hit.toLocaleString('ko-KR');

const getArticleTagLabel = (boardId: number) => convertArticlesTag(boardId).replace(/^\[|\]$/g, '');

export default function ArticleHeader({ boardId, title, registeredAt, author, hit, isNew }: ArticleHeaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles['title__board-id-desktop']}>{convertArticlesTag(boardId)}</span>
          <span className={styles['title__board-id-mobile']}>{getArticleTagLabel(boardId)}</span>
          <span className={styles.title__content}>{title}</span>
          {isNew && (
            <Image
              className={styles['title__new-tag']}
              src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
              alt="new"
              width={15}
              height={15}
            />
          )}
        </div>
        <div className={styles.content}>
          <div className={styles['content__desktop']}>
            <div className={styles.content__author}>{author}</div>
            <div className={styles['content__registered-at']}>{registeredAt}</div>
          </div>
          <div className={styles['content__mobile']}>
            <span>{formatMobileDate(registeredAt)}</span>
            <span>·</span>
            <span>{author}</span>
            <span>·</span>
            <span className={styles.content__hit}>
              <ViewIcon aria-hidden />
              {formatViewCount(hit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
