import StoreIcon from 'assets/svg/Store/store-icon.svg';
import MenuIcon from 'assets/svg/Store/menu-icon.svg';
import NavigateStoreIcon from 'assets/svg/Store/navigate-store-icon.svg';
import styles from './RelateSearchItem.module.scss';

interface RelateSearchItemProps {
  url : string | null;
  content : string;
  onClick: () => void;
}
export default function RelateSearchItem({ url, content, onClick }:RelateSearchItemProps) {
  return (
    <button type="button" className={styles.item__box} onClick={onClick}>
      <div className={styles['item__left-box']}>
        <div className={styles.item__icon}>
          {url ? <StoreIcon /> : <MenuIcon />}
        </div>
        <p className={styles.item__content}>{content}</p>
      </div>
      {url && <div className={styles.item__navigate}><NavigateStoreIcon /></div>}
    </button>
  );
}
