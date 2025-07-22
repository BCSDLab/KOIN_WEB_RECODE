import StoreIcon from 'assets/svg/Club/big-store-icon.svg';
import NavigateStoreIcon from 'assets/svg/Club/big-navigate-icon.svg';
import styles from './RelateSearchItem.module.scss';

interface RelateSearchItemProps {
  url : string;
  content : string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function RelateSearchItem({ url, content, onClick }: RelateSearchItemProps) {
  return (
    <button type="button" className={styles.item__box} onClick={onClick}>
      <div className={styles['item__content-wrapper']}>
        <StoreIcon />
        <p className={styles.item__content}>{content}</p>
      </div>
      {url && <div className={styles.item__navigate}><NavigateStoreIcon /></div>}
    </button>
  );
}
