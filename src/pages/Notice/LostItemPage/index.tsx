import { useLocation } from 'react-router-dom';
import styles from './LostItemPage.module.scss';

type LostItemType = 'found' | 'lost';

export default function LostItemPage() {
  const location = useLocation();
  const type: LostItemType = location.pathname.includes('/found') ? 'found' : 'lost';
  console.log(type);

  return (
    <div className={styles.container}>
      s
    </div>
  );
}
