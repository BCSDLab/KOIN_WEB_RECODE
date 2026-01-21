import styles from './LostItemsHeader.module.scss';

type HeaderRowInfo = {
  [key: string]: string;
};

const HEADER_ROW: HeaderRowInfo = {
  classification: '분류',
  title: '제목',
  author: '작성자',
  date: '날짜',
  stat: '물품 상태',
};

export default function LostItemsHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__row}>
          {Object.keys(HEADER_ROW).map((key) => (
            <div key={key} className={styles.info}>
              {HEADER_ROW[key]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
