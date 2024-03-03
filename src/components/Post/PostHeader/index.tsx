import cn from 'utils/ts/classnames';
import styles from './PostHeader.module.scss';

type HeaderRowInfo = {
  [key: string]: string
};

const HEADER_ROW: HeaderRowInfo = {
  number: '번호',
  title: '제목',
  author: '작성자',
  date: '날짜',
};

function PostHeader() {
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

export default PostHeader;
