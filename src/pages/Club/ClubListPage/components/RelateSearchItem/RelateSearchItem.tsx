import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import StoreIcon from 'assets/svg/Club/big-store-icon.svg';
import BigNavigateIcon from 'assets/svg/Club/big-navigate-icon.svg';
import NavigateIcon from 'assets/svg/Store/navigate-store-icon.svg';
import styles from './RelateSearchItem.module.scss';

interface RelateSearchItemProps {
  url : string;
  content : string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function RelateSearchItem({ url, content, onClick }: RelateSearchItemProps) {
  const isMobile = useMediaQuery();

  return (
    <button type="button" className={styles.item__box} onClick={onClick}>
      <div className={styles['item__content-wrapper']}>
        {!isMobile && <StoreIcon />}
        <p className={styles.item__content}>{content}</p>
      </div>
      {url && (
      <div className={styles.item__navigate}>
        {isMobile ? <NavigateIcon /> : <BigNavigateIcon />}
      </div>
      )}
    </button>
  );
}
