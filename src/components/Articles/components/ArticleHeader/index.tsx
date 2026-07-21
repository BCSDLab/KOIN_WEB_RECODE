import Image from 'next/image';
import { convertArticlesTag } from 'components/Articles/utils/convertArticlesTag';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './ArticleHeader.module.scss';

interface ArticleHeaderProps {
  boardId: number;
  title: string;
  registeredAt: string;
  author: string;
  hit: number;
  isNew: boolean;
}

export default function ArticleHeader({ boardId, title, registeredAt, author, hit, isNew }: ArticleHeaderProps) {
  const isMobile = useMediaQuery();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles['title__board-id']}>{convertArticlesTag(boardId)}</span>
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
          <div className={styles.content__author}>{isMobile ? `조회 ${hit} · ${author}` : author}</div>
          <div className={styles['content__registered-at']}>{registeredAt}</div>
        </div>
      </div>
    </div>
  );
}
