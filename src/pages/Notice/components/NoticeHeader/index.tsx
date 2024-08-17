import { cn } from '@bcsdlab/utils';
import styles from './NoticeHeader.module.scss';

type HeaderRowInfo = {
  [key: string]: string
};

const HEADER_ROW: HeaderRowInfo = {
  number: '번호',
  title: '제목',
  author: '작성자',
  date: '날짜',
};

export default function NoticeHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__row}>
          {
            Object.keys(HEADER_ROW).map((key) => (
              <div
                key={HEADER_ROW[key]}
                className={cn({
                  [styles.info]: true,
                  [styles[`info--${key}`]]: true,
                })}
              >
                {HEADER_ROW[key]}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
