import NavigateStoreIcon from 'assets/svg/Store/navigate-store-icon.svg';
import styles from './RelateSearchItem.module.scss';

interface RelateSearchItemProps {
  url : string;
  content : string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function RelateSearchItem({ url, content, onClick }: RelateSearchItemProps) {
  return (
    <button type="button" className={styles.item__box} onClick={onClick}>
      <p className={styles.item__content}>{content}</p>
      {url && <div className={styles.item__navigate}><NavigateStoreIcon /></div>}
    </button>
  );
}
